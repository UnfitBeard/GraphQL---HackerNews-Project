import express from "express";
import { Worker } from "bullmq";

const app = express();
app.use(express.json());

app.listen(3002, () => {
  console.log("User service started on port 3001");
});
