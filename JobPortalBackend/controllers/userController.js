import User from "../models/user.js";
import { uploadResume } from "../middleware/upload.js";

export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        const user = await User.findById(userId);

        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({ success: false, message: "Job already saved" });
        }

        user.savedJobs.push(jobId);
        await user.save();

        res.status(200).json({ success: true, message: "Job saved successfully", data: user.savedJobs });
    } catch (error) {
        console.error("Save Job Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);

        user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
        await user.save();

        res.status(200).json({ success: true, message: "Job removed from saved list", data: user.savedJobs });
    } catch (error) {
        console.error("Remove Saved Job Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("savedJobs");

        res.status(200).json({ success: true, data: user.savedJobs });
    } catch (error) {
        console.error("Get Saved Jobs Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .select('-password')
            .populate('savedJobs')
            .populate('appliedJobs');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const allowedUpdates = [
            'name', 'phone', 'location', 'bio', 'avatarUrl',
            'skills', 'experience', 'education',
            'resume', 'linkedin', 'github', 'portfolio'
        ];

        // Filter only allowed fields from request body
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const uploadUserResume = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Construct the file URL
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;

        // Update user profile with resume URL
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { resume: resumeUrl } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                resume: resumeUrl,
                user: user
            }
        });
    } catch (error) {
        console.error("Upload Resume Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const uploadUserAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Construct the file URL
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        // Update user profile with avatar URL
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { avatarUrl: avatarUrl } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            data: {
                avatarUrl: avatarUrl,
                user: user
            }
        });
    } catch (error) {
        console.error("Upload Avatar Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteUserAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $unset: { avatarUrl: "" } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Avatar deleted successfully",
            data: {
                user: user
            }
        });
    } catch (error) {
        console.error("Delete Avatar Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
