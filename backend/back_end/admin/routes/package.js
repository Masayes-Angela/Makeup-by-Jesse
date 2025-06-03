import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import {
  addPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  reactivatePackage, // ✅ only keep what's exported
} from "../controllers/packageController.js"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, "../../../uploads/packages")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "package-" + uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  cb(null, allowedTypes.includes(file.mimetype))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

// Routes
router.post("/", upload.single("image"), addPackage)
router.get("/", getPackages)
router.get("/:id", getPackageById)
router.put("/:id", upload.single("image"), updatePackage)
router.delete("/:id", deletePackage)
router.patch("/restore/:id", reactivatePackage) 

export default router