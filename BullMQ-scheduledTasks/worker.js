import { Worker } from "bullmq";
import { welcomeMessage, redisOptions, exportData, sendEmail } from "./index.js";

const jobHandlers = {
  welcomeMessage: welcomeMessage,
  dataExport: exportData,
  sendEmail: sendEmail
};

const processJob = async (job) => {
  const handler = jobHandlers[job.name];

  if (handler) {
    console.log(`Processing Job: ${job.name}`);
    await handler(job);
  }
};

const worker = new Worker("myQueue", processJob, { connection: redisOptions });

worker.on("completed", (job) => {
  console.log(`${job.id} has completed`)
})

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})

console.log("Worker Started");