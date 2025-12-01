import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const  connectDB = async ()=>{
    try{
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("databse connect successfully");
    }
    catch(error){
        console.log("error in connecting the database",error)
    }
}

export default connectDB;