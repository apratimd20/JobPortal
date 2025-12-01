import axios from "axios";
import Job from "../models/Job.js";

export const fetchJobsFromAPI = async () => {
  try {
    console.log("🔍 Fetching jobs from RapidAPI...");

    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: { query: "developer", num_pages: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response");
    }

    const jobs = response.data.data;
    let storedCount = 0;
    let errorCount = 0;

    for (let job of jobs) {
      try {
        
        const exists = await Job.findOne({ job_id: job.job_id });
        if (exists) {
          console.log(`⏭️ Skipping existing job: ${job.job_title}`);
          continue;
        }
        const mapJobType = (apiJobType) => {
          const typeMap = {
            'full-time': 'Full-Time',
            'fulltime': 'Full-Time',
            'part-time': 'Part-Time', 
            'parttime': 'Part-Time',
            'contract': 'Contract',
            'contractor': 'Contract',
            'internship': 'Internship',
            'remote': 'Remote',
            'hybrid': 'Hybrid'
          };
          return typeMap[apiJobType?.toLowerCase()] || 'Full-Time';
        };

        
        const extractExperience = (description) => {
          if (!description) return "Not specified";
          
          const desc = description.toLowerCase();
          if (desc.includes('senior') || desc.includes('5+ years') || desc.includes('5 years') || desc.includes('7+ years')) {
            return "Senior Level";
          } else if (desc.includes('mid-level') || desc.includes('mid level') || desc.includes('3+ years') || desc.includes('3 years') || desc.includes('2-5 years')) {
            return "Mid Level";
          } else if (desc.includes('junior') || desc.includes('entry level') || desc.includes('0-2 years') || desc.includes('1+ years')) {
            return "Junior Level";
          } else if (desc.includes('intern') || desc.includes('internship')) {
            return "Internship";
          }
          return "Not specified";
        };

        
        await Job.create({
          job_id: job.job_id,
          title: job.job_title || "Not provided",
          company: job.employer_name || "Unknown",
          location: job.job_city || job.job_country || "Remote",
          description: job.job_description || "No description",
          jobType: mapJobType(job.job_employment_type),
          experience: extractExperience(job.job_description), 
          salary: job.job_salary || "Not specified",
          skills: job.job_required_skills || [],
          scraped: true,
          dateFetched: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        storedCount++;
        console.log(` Stored: ${job.job_title} at ${job.employer_name}`);
        
      } catch (error) {
        errorCount++;
        console.error(` Error storing job (${job.job_id}):`, error.message);
      }
    }

    console.log(" [SERVICE] Job fetch completed:", {
      fetchedCount: jobs.length,
      storedCount,
      errorCount,
      timestamp: new Date().toISOString(),
    });

    return { fetchedCount: jobs.length, storedCount, errorCount };
  } catch (error) {
    console.error("❌ [SERVICE ERROR] Failed to fetch jobs:", {
      message: error.message,
      time: new Date().toISOString(),
    });
    throw error; 
  }
};