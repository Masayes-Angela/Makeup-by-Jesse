import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

// Get directory paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import routes
import aboutMeRoutes from "./back_end/admin/routes/aboutMe.js"
import serviceRoutes from "./back_end/admin/routes/services.js"
import profileRoutes from "./back_end/admin/routes/profile.js"
import galleryRoutes from "./back_end/admin/routes/gallery.js"
import contactRoutes from "./back_end/admin/routes/contact.js"
import messageRoutes from "./back_end/admin/routes/message.js"
import socialRoutes from "./back_end/admin/routes/social.js"
import packageRoutes from "./back_end/admin/routes/package.js"
import faqRoutes from './back_end/admin/routes/faqRoutes.js';
import reviewRoutes from './back_end/admin/routes/reviewRoutes.js';

const app = express()
const PORT = process.env.PORT || 8080

// Middleware
app.use(cors())
// Increase JSON size limit to handle base64 images
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"))
// Serve static files from the specific packages directory
app.use("/uploads/packages", express.static("C:\\Users\\princ\\OneDrive\\AppData\\Desktop\\MakeUp by Jesse\\Makeup-by-Jesse\\backend\\uploads\\packages"))

// Route mounting
app.use("/api/about", aboutMeRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/socials", socialRoutes)
app.use("/api/packages", packageRoutes)
app.use('/api/faqs', faqRoutes);
app.use('/api/reviews', reviewRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🎉 Makeup by Jesse API is up and running!")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
