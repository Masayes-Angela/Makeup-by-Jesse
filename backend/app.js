import express from "express"
import cors from "cors"
import { getServices, getService, addService, updateService, deleteService } from "./back_end/admin/services.js"

import profileRoutes from "./back_end/admin/routes/profile.js";
import galleryRoutes from "./back_end/admin/routes/gallery.js";
const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" })) // For handling image uploads

// ✅ Connect /profile and /gallery routes
app.use("/profile", profileRoutes);
app.use("/gallery", galleryRoutes);

// GET all services
app.get("/services", async (req, res) => {
  try {
    const services = await getServices()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET a single service
app.get("/services/:id", async (req, res) => {
  try {
    const service = await getService(req.params.id)
    if (service) {
      res.json(service)
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST a new service
app.post("/services", async (req, res) => {
  try {
    const newService = await addService(req.body)
    res.status(201).json(newService)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT/update a service
app.put("/services/:id", async (req, res) => {
  try {
    const result = await updateService(req.body, req.params.id)
    if (result.affectedRows) {
      const updatedService = await getService(req.params.id)
      res.json(updatedService)
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE a service
app.delete("/services/:id", async (req, res) => {
  try {
    console.log(`Received DELETE request for service ID: ${req.params.id}`)
    const result = await deleteService(req.params.id)
    console.log("Delete result:", result)

    if (result.affectedRows) {
      res.json({ message: "Service deleted successfully", id: req.params.id })
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    console.error("Error in DELETE endpoint:", error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
