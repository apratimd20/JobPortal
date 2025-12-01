import express from 'express'
import connectDB from './config/db.js';
import { fetchJobsFromAPI } from './services/fetchJobs.js';
import jobRoutes from './routes/jobRoutes.js'
import cors from 'cors'

import './corn/fetchCorn.js'
import './corn/deleteCorn.js'

const app = express();
const Port = 5000;

await connectDB();

app.use(express.json())
app.use(cors());

await fetchJobsFromAPI();

app.get("/",(req,res)=>{
  res.status(200).send("hello")
})

app.use('/api/jobs', jobRoutes);
 

app.listen(Port,()=>{
    console.log("Server is running on the port 5000");
})