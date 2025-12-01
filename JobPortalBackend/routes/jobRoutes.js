import express from 'express';
import {
  getAllJobs,
  getJobById,
  getJobsByCompany,
  getJobLocations,
  getJobTypes,
  getExperienceLevels,
  getFeaturedJobs,
  advancedSearch
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllJobs); // GET /api/jobs
router.get('/featured', getFeaturedJobs); // GET /api/jobs/featured
router.get('/search/advanced', advancedSearch); // GET /api/jobs/search/advanced
router.get('/locations', getJobLocations); // GET /api/jobs/locations
router.get('/job-types', getJobTypes); // GET /api/jobs/job-types
router.get('/experience-levels', getExperienceLevels); // GET /api/jobs/experience-levels
router.get('/company/:company', getJobsByCompany); // GET /api/jobs/company/:company
router.get('/:id', getJobById); // GET /api/jobs/:id

export default router;