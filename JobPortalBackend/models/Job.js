import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    job_id: {  
      type: String,
      unique: true,
      sparse: true,
    },
    
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote", "Hybrid"],
      default: "Full-Time",
    },

    experience: {
      type: String, 
       default: "Not specified",
    },

    salary: {
      type: String, 
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },

    scraped: {
      type: Boolean,
      default: false, 
    },

    dateFetched: { 
      type: Date,
      default: Date.now,
    },
     expiresAt: { 
      type: Date,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      index: { expires: 0 } 
    }
  },
  
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);