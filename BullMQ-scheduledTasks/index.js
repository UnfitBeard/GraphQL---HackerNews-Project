import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };

const myQueue = new Queue("myQueue", { connection: redisOptions });

async function addJob(job, priority) {
  const options = { repeat: { every: 5000 }, priority };
  // Can also use cron for scheduling....syntax repeat : {cron:"* * * * *"}
  // uses minute, hour , day of month, month, day of week
  if (priority !== undefined) {
    options.priority = priority
  }
  await myQueue.add(job.name, job, options);
}

export const welcomeMessage = () => {
  console.log("Sending a welcome message every few seconds");
};

export const exportData = (job) => {
  const {name, path} = job.data.jobData;
  console.log(`Exporting ${name} data to ${path}`)
}


await addJob({ name: "welcomeMessage" },10);
await addJob({
  name: "dataExport",
  jobData: {
    name: "Sales Report",
    path: "/some/path"
  }
})
