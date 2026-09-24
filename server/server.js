import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./src/config/dbConnect.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";
import websiteRouter from "./src/routes/website.route.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Cookies
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "https://archonaibuilder.vercel.app",
    credentials: true,
  })
);

// Database
dbConnect();

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);

// Serve React frontend
app.use(express.static(path.join(__dirname, "dist")));

// React Router fallback
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(
      path.join(__dirname, "dist", "index.html")
    );
  }

  next();
});

// Server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;