import express from "express";
import {
  registerUser,
  loginUser,
  // getUserProfile,
  // updateUserProfile,
} from "../controllers/AuthController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);


// router.get("/profile", protect, getUserProfile);


// router.put("/profile", protect, authorizeRoles("jobseeker", "jobprovider"), updateUserProfile);

export default router;
