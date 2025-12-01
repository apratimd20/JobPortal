import cron from "node-cron";
import Job from "../models/Job.js";


cron.schedule("0 0 * * *", async () => {
  console.log("🗑️ [CRON] Deleting old scraped jobs...");

  try {
   
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const result = await Job.deleteMany({ 
      scraped: true,
      dateFetched: { $lt: sevenDaysAgo }
    });

    console.log(" Deleted scraped jobs older than 7 days:", {
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to delete scraped jobs:", {
      message: error.message,
      time: new Date().toISOString(),
    });
  }
});