import express from "express";
import multer from "multer";
import {
  createService,
  fetchAllServices,
  fetchServiceById,
  modifyService,
  deactivateService,
  reactivateService,
} from "../controllers/serviceController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/services"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createService);
router.get("/", fetchAllServices);
router.get("/:id", fetchServiceById);
router.put("/:id", upload.single("image"), modifyService);
router.patch("/deactivate/:id", deactivateService);
router.patch("/restore/:id", reactivateService);

export default router;