import express from "express"
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
const uploadsDir = path.join(__dirname, "../../../../uploads/packages")
console.log("Packages uploads directory:", uploadsDir)

if (!fs.existsSync(uploadsDir)) {
  console.log("Creating uploads directory for packages")
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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
router.post("/", addPackage)
router.get("/", getPackages)
router.get("/:id", getPackageById)
router.put("/:id", updatePackage)
router.delete("/:id", deletePackage)
router.patch("/deactivate/:id", deactivatePackage)
router.patch("/restore/:id", reactivatePackage)

export default router
