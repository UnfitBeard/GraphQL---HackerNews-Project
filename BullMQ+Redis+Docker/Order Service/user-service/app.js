import express from "express";
import { Worker } from "bullmq";

const app = express();
app.use(express.json());

const userDB = [{
  id: 1, 
  name: "GTH",
  password: "1234",
  email:"g@gmail.com"
}]

const verificationWorker = new Worker(
  "user-verification-queue",
  (job) => {
    const userId = job.data.userId

    console.log(`Job Recv with a userID: ${userId} and job id: ${job.id}`)

    const isValidUser = userDB.some((item) => item.id == userId)

    console.log(`User Valid ${isValidUser}`)

    const {password, ...rest} = userDB[0]

    return { isValidUser,rest }
  }, {
    connection: {
      host: '127.0.0.1',
      port: 6379
    }
  }
)

app.listen(3001, () => {
  console.log("User service started on port 3001");
});
