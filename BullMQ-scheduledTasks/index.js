import { Queue } from "bullmq";
import nodemailer from "nodemailer";

export const redisOptions = { host: "localhost", port: 6379 };

const myQueue = new Queue("myQueue", { connection: redisOptions });

async function addJob(job, priority) {
  const options = { repeat: { every: 5000 }, priority };
  // Can also use cron for scheduling....syntax repeat : {cron:"* * * * *"}
  // uses minute, hour , day of month, month, day of week
  if (priority !== undefined) {
    options.priority = priority;
  }
  await myQueue.add(job.name, job, options);
}

export const welcomeMessage = () => {
  console.log("Sending a welcome message every few seconds");
};

export const exportData = (job) => {
  const { name, path } = job.data.jobData;
  console.log(`Exporting ${name} data to ${path}`);
};

export const sendEmail = (job) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "onseriodickson2@gmail.com",
      pass: "@Kdirving123",
    },
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: "njunge995@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?", // plain‑text body
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent:", info.messageId);
  })();
};

await addJob({ name: "welcomeMessage" }, 10);
await addJob({
  name: "dataExport",
  jobData: {
    name: "Sales Report",
    path: "/some/path",
  },
});
