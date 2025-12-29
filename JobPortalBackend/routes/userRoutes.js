import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/AuthController.js";
import {
  saveJob,
  deleteSavedJob,
  getSavedJobs,
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

// Saved Jobs Routes
router.post("/saved-jobs", protect, saveJob);
router.delete("/saved-jobs/:jobId", protect, deleteSavedJob);
router.get("/saved-jobs", protect, getSavedJobs);

export default router;
