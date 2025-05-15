import express from "express";
import multer from "multer";
import { uploadImage, deleteImage, getAllImages } from "../controllers/galleryController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/gallery/" }); // fixed typo from "galleery"

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.delete("/:id", deleteImage);

export default router;