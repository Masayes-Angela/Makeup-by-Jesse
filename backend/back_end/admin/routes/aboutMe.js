import express from "express";
import { getAboutMe, updateAboutMe } from "../controllers/aboutMeController.js";
import multer from "multer";

const router = express.Router();

router.get("/", getAboutMe);
router.put("/", updateAboutMe); 

export default router;