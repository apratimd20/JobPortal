import mongoose from 'mongoose'

const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
    },
    role:{
        type:String,
        enum:["jobseeker","jobprovider"],
        default:"jobseeker",
    }
    ,savedJobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job",
        },
    ],
    appliedJobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job",
        },
    ],
  
}, { timestamps:true})
    
export default mongoose.model("user",userSchema)