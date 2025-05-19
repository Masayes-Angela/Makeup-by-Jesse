import express from "express";
import cors from "cors";

// Route Imports
import serviceRoutes from "./back_end/routes/services.js";
import profileRoutes from "./back_end/admin/routes/profile.js";
import galleryRoutes from "./back_end/admin/routes/gallery.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Route mounting
app.use("/api/services", serviceRoutes);     // ✅ All service endpoints here
app.use("/api/profile", profileRoutes);      // Adjusted prefix
app.use("/api/gallery", galleryRoutes);      // Adjusted prefix

// Default health route
app.get("/", (req, res) => {
  res.send("🎉 API is up and running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});