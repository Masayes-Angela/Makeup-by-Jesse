import express from "express";
import {
  getContactInfo,
  updateContactInfo,
  addContactInfo
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", addContactInfo); // Admin upload
router.get("/", getContactInfo);       // For public site
router.put("/", updateContactInfo);    // For admin update

export default router;