import Job from "../models/Job.js";

// @desc    Get all jobs (public - no auth required)
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experience,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};

    // Search in title, company, description, skills
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Filter by job type
    if (jobType) {
      filter.jobType = jobType;
    }

    // Filter by experience
    if (experience) {
      filter.experience = experience;
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const jobs = await Job.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v'); // Exclude version key

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching job',
      error: error.message
    });
  }
};

// @desc    Get jobs by company
// @route   GET /api/jobs/company/:company
// @access  Public
export const getJobsByCompany = async (req, res) => {
  try {
    const { company } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const jobs = await Job.find({ 
      company: { $regex: company, $options: 'i' } 
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Job.countDocuments({ 
      company: { $regex: company, $options: 'i' } 
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    console.error('Get jobs by company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching company jobs',
      error: error.message
    });
  }
};

// @desc    Get unique job locations
// @route   GET /api/jobs/locations
// @access  Public
export const getJobLocations = async (req, res) => {
  try {
    const locations = await Job.distinct('location');
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations.filter(loc => loc && loc.trim() !== ''),
    });
  } catch (error) {
    console.error('Get job locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching locations',
      error: error.message
    });
  }
};

// @desc    Get unique job types
// @route   GET /api/jobs/job-types
// @access  Public
export const getJobTypes = async (req, res) => {
  try {
    const jobTypes = await Job.distinct('jobType');
    
    res.status(200).json({
      success: true,
      count: jobTypes.length,
      data: jobTypes.filter(type => type && type.trim() !== ''),
    });
  } catch (error) {
    console.error('Get job types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job types',
      error: error.message
    });
  }
};

// @desc    Get unique experience levels
// @route   GET /api/jobs/experience-levels
// @access  Public
export const getExperienceLevels = async (req, res) => {
  try {
    const experiences = await Job.distinct('experience');
    
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences.filter(exp => exp && exp.trim() !== ''),
    });
  } catch (error) {
    console.error('Get experience levels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching experience levels',
      error: error.message
    });
  }
};

// @desc    Get featured jobs (most recent)
// @route   GET /api/jobs/featured
// @access  Public
export const getFeaturedJobs = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title company location jobType experience salary createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Get featured jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured jobs',
      error: error.message
    });
  }
};

// @desc    Search jobs with advanced filtering
// @route   GET /api/jobs/search/advanced
// @access  Public
export const advancedSearch = async (req, res) => {
  try {
    const {
      keywords,
      location,
      jobType,
      experience,
      skills,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};

    // Keyword search
    if (keywords) {
      filter.$or = [
        { title: { $regex: keywords, $options: 'i' } },
        { company: { $regex: keywords, $options: 'i' } },
        { description: { $regex: keywords, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }

    // Experience filter
    if (experience) {
      filter.experience = experience;
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skills = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    // Salary range filter (if salary field contains numeric values)
    if (minSalary || maxSalary) {
      // This is a basic implementation - you might need to adjust based on your salary format
      filter.salary = {};
      if (minSalary) filter.salary.$gte = minSalary;
      if (maxSalary) filter.salary.$lte = maxSalary;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while performing search',
      error: error.message
    });
  }
};