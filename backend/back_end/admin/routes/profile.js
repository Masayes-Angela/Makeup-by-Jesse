import express from "express";
import multer from "multer";
import {
  updateProfile,
  getProfile,
  createProfile,
  updateAdminSettings,
  updatePassword
} from "../controllers/profileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Profile routes
router.get("/:id", getProfile); // GET profile by ID
router.post("/", upload.single("profile_image"), createProfile); // CREATE profile
router.post("/:id/upload", upload.single("profile_image"), updateProfile); // UPDATE name/title/desc/image

// Admin settings and password update
router.put("/:id/settings", updateAdminSettings); // UPDATE email, contact, toggles, role
router.put("/:id/password", updatePassword); // UPDATE password securely

export default router;
