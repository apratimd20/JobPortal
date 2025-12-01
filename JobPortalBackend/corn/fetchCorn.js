import cron from "node-cron";
import { fetchJobsFromAPI } from "../services/fetchJobs.js";

cron.schedule("0 * * * *", async () => {
  console.log("⏳ [CRON] Running scheduled job fetch...");

  try {
    const result = await fetchJobsFromAPI();

    console.log("Job fetch completed:", {
      fetched: result?.fetchedCount || 0,
      stored: result?.storedCount || 0,
      errors: result?.errorCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(" Failed to fetch jobs:", {
      message: error.message,
      time: new Date().toISOString(),
    });
  }
});