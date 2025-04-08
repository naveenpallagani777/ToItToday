import mongoose from 'mongoose';
import express from 'express';
import cors from "cors";

import router from "./Routers/appRouter.js"; 
import dotenv from 'dotenv';
dotenv.config();

let options = {
    origin: ["https://do-it-today.vercel.app"]
}

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

const app = express();

app.use(cors(options));
app.use(express.json());
app.use(router);