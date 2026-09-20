import express from "express";
import { deploy, generateWebsite, getAllWebsite, getBySlug, getWebsiteById, wesbsiteChanges } from "../controller/website.contoller.js";
import isAuth from "../middleware/isAuth.middleware.js";


const websiteRouter = express.Router()

websiteRouter.post("/generate", isAuth, generateWebsite)
websiteRouter.post("/update/:id", isAuth, wesbsiteChanges)
websiteRouter.get("/get-website/:id", isAuth, getWebsiteById)
websiteRouter.get("/all-website", isAuth, getAllWebsite)
websiteRouter.get("/deploy/:id", isAuth, deploy);
websiteRouter.get("/get-by-slug/:slug", getBySlug);

export default websiteRouter