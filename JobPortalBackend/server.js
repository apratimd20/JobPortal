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

app.use(express.json());


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://job-portal-tawny-eight.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


await fetchJobsFromAPI();

app.get("/", (req, res) => {
  res.status(200).send("hello");
});


app.use('/api/jobs', jobRoutes);

app.listen(Port, () => {
  console.log("Server is running on the port 5000");
});
