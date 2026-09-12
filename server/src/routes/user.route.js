import express from "express";
import getMe from "../controller/user.controller.js";
import isAuth from "../middleware/isAuth.middleware.js";
const userRouter = express.Router()

userRouter.get("/me", isAuth, getMe)

export default userRouter