import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Connection check karne ke liye ping test function
const checkRedisConnection = async () => {
  try {
    const response = await redis.ping();
    if (response === "PONG") {
      console.log("Redis (Upstash) connected successfully!");
    }
  } catch (error) {
    console.error("Redis (Upstash) connection error:", error.message);
  }
};

checkRedisConnection();

export default redis;