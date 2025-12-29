import User from "../models/user.js";
import Job from "../models/Job.js"; // Assuming Job model exists and is exported as default

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
