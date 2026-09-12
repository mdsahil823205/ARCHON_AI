import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./src/config/dbConnect.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Cookies
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Database Connection
dbConnect();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;