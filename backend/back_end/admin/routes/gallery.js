import express from "express";
import {
  addGalleryPhoto,
  getActivePhotos,
  getAllGalleryPhotos,
  deactivateGalleryPhoto,
  reactivateGalleryPhoto,
} from "../controllers/galleryController.js";

const router = express.Router();

router.post("/", addGalleryPhoto); // Admin upload
router.get("/", getActivePhotos);  // For public carousel
router.get("/all", getAllGalleryPhotos); // Admin full view
router.patch("/deactivate/:id", deactivateGalleryPhoto);
router.patch("/restore/:id", reactivateGalleryPhoto);

export default router;