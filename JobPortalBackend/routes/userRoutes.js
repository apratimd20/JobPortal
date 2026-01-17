import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/AuthController.js";
import {
  saveJob,
  deleteSavedJob,
  getSavedJobs,
  getUserProfile,
  updateUserProfile,
  uploadUserResume,
  uploadUserAvatar,
  deleteUserAvatar,
} from "../controllers/userController.js";

import { uploadResume, uploadAvatar } from "../middleware/upload.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

// Saved Jobs Routes
router.post("/saved-jobs", protect, saveJob);
router.delete("/saved-jobs/:jobId", protect, deleteSavedJob);
router.get("/saved-jobs", protect, getSavedJobs);

// Profile Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/upload-resume", protect, uploadResume.single('resume'), uploadUserResume);
router.post("/upload-avatar", protect, uploadAvatar.single('avatar'), uploadUserAvatar);
router.delete("/avatar", protect, deleteUserAvatar);

export default router;
