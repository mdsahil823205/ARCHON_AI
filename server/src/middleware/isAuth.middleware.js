import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import redis from "../config/redis.js"; // Aapka Upstash instance

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cacheKey = `user:${decoded.id}`;

    // 1. Pehle Redis check karo
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      // Redis hit! MongoDB call bach gaya
      req.user = cachedUser;
      return next();
    }

    // 2. Cache miss hone par Database se lo
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, please login again",
      });
    }

    // 3. User ko Redis mein cache karo (7 din ke liye)
    await redis.set(cacheKey, user, { ex: 7 * 24 * 60 * 60 });

    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please login again",
    });
  }
};

export default isAuth;