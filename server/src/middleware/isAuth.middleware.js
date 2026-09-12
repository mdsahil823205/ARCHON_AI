import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

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

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, please login again",
      });
    }

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