import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["jobseeker", "jobprovider"],
        default: "jobseeker",
    },
    // Profile fields
    phone: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    avatarUrl: {
        type: String,
    },
    skills: [{
        type: String,
        trim: true,
    }],
    experience: [{
        company: { type: String, trim: true },
        position: { type: String, trim: true },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        description: { type: String },
    }],
    education: [{
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        field: { type: String, trim: true },
        startYear: { type: String },
        endYear: { type: String },
        current: { type: Boolean, default: false },
    }],
    resume: {
        type: String, // URL to resume
    },
    linkedin: {
        type: String,
    },
    github: {
        type: String,
    },
    portfolio: {
        type: String,
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],

    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],

}, { timestamps: true })

export default mongoose.model("user", userSchema)