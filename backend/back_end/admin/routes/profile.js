import express from "express";
import multer from "multer";
import { updateProfile, getProfile, createProfile } from "../controllers/profileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Route now supports GET /profile/:id and POST /profile/:id/upload
router.get("/:id", getProfile);
router.post("/:id/upload", upload.single("profile_image"), updateProfile);
router.post("/", upload.single("profile_image"), createProfile);

export default router;
