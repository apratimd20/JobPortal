import express from 'express';
import {
  getAllJobs,
  getJobById,
  getJobsByCompany,
  getJobLocations,
  getJobTypes,
  getExperienceLevels,
  getFeaturedJobs,
  advancedSearch,
  postJob,
  getProviderJobs,
  getProviderStats
} from '../controllers/jobController.js';
import { providerOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllJobs);
router.get('/featured', getFeaturedJobs);
router.get('/search/advanced', advancedSearch);
router.get('/locations', getJobLocations);
router.get('/job-types', getJobTypes);
router.get('/experience-levels', getExperienceLevels);
router.get('/company/:company', getJobsByCompany);
router.get('/:id', getJobById);
router.get('/provider/my-jobs', protect, providerOnly, getProviderJobs);
router.get('/provider/stats', protect, providerOnly, getProviderStats);

router.post(
  "/",
  protect,
  providerOnly,
  postJob
);



export default router;