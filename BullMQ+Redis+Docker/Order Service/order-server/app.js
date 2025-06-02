import express from "express";
import { Queue, QueueEvents } from "bullmq";

const app = express();

app.use(express.json());

// Queue
const verifyUser = new Queue("user-verification-queue");
const verificationQueueEvents = new QueueEvents("user-verification-queue");
const mailQueue = new Queue("mail-queue");

const checkUserVerification = (jobId) => {
  return new Promise((resolve, reject) => {
    verificationQueueEvents.on(
      "completed",
      ({ jobId: completedJobId, returnValue }) => {
        if (jobId == completedJobId) {
          const { isValidUser, rest } = returnValue;
          resolve({ isValidUser, rest });
        }
      }
    );

    verificationQueueEvents.on(
      "failed",
      ({ jobId: failedJobId, failedReason }) => {
        if (jobId == failedJobId) {
          reject(new Error(failedReason));
        }
      }
    );
  });
};

app.post("/order", async (req, res) => {
  try {
    const { orderId, productName, price, userId } = req.body;
    const job = await verifyUser.add("Verify User", { userId });
    let { isValidUser }= await checkUserVerification(job.id);

    if (!isValidUser) {
      return res.send({
        message: "User not valid",
      });
    }

    // save order to database;

    const mailJob = await mailQueue.add("Send Mail");

    res.send({
      message: "User is valid",
      rest
    });
  } catch (error) {
    console.log({ error });
  }
});

app.listen(3000, () => {
  console.log("Order service started on port 3000");
});
