import express from "express";
import {
  getSocialLinks,
  upsertSocialLink,
  deactivateSocialLink,
  reactivateSocialLink,
} from "../controllers/socialController.js";

const router = express.Router();

router.get("/", getSocialLinks);
router.post("/", upsertSocialLink);
router.patch("/deactivate/:id", deactivateSocialLink);
router.patch("/restore/:id", reactivateSocialLink);

export default router;