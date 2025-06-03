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
  deactivatePackage,
  reactivatePackage,
} from "../controllers/packageController.js"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../../uploads/packages")
console.log("Packages uploads directory:", uploadsDir)

if (!fs.existsSync(uploadsDir)) {
  console.log("Creating uploads directory for packages")
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadsDir)
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const filename = "package-" + uniqueSuffix + ext
    console.log("Generated filename:", filename)
    cb(null, filename)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed."), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Debug route to list files in uploads directory
router.get("/debug/files", (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        exists: false,
        path: uploadsDir,
        message: "Uploads directory does not exist",
      })
    }

    const files = fs.readdirSync(uploadsDir)
    res.json({
      exists: true,
      path: uploadsDir,
      files,
      count: files.length,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Routes
router.post("/", upload.single("image"), addPackage)
router.get("/", getPackages)
router.get("/:id", getPackageById)
router.put("/:id", upload.single("image"), updatePackage)
router.delete("/:id", deletePackage)
router.patch("/deactivate/:id", deactivatePackage)
router.patch("/restore/:id", reactivatePackage)

export default router
