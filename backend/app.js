import express from "express";
import cors from "cors";

// Route Imports
import aboutMeRoutes from "./back_end/admin/routes/aboutMe.js";
import serviceRoutes from "./back_end/admin/routes/services.js";
import profileRoutes from "./back_end/admin/routes/profile.js";
import galleryRoutes from "./back_end/admin/routes/gallery.js";
import contactRoutes from "./back_end/admin/routes/contact.js";
import messageRoutes from "./back_end/admin/routes/message.js";
import socialRoutes from "./back_end/admin/routes/social.js";
import packageRoutes from "./back_end/admin/routes/package.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Route mounting
app.use("/api/about", aboutMeRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api/packages", packageRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🎉 API is up and running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});