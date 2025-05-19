import express from "express";
import multer from "multer";
import {
  addPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deactivatePackage,
  reactivatePackage,
} from "../controllers/packageController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/packages"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addPackage); // CREATE
router.get("/", getPackages);                         // READ ALL
router.get("/:id", getPackageById);                   // READ ONE
router.put("/:id", upload.single("image"), updatePackage); // UPDATE
router.patch("/deactivate/:id", deactivatePackage);   // SOFT DELETE
router.patch("/restore/:id", reactivatePackage);      // REACTIVATE

export default router;