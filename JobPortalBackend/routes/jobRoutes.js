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


router.get('/', getAllJobs); 
router.get('/featured', getFeaturedJobs);
router.get('/search/advanced', advancedSearch); 
router.get('/locations', getJobLocations);
router.get('/job-types', getJobTypes);
router.get('/experience-levels', getExperienceLevels); 
router.get('/company/:company', getJobsByCompany); 
router.get('/:id', getJobById); 

export default router;