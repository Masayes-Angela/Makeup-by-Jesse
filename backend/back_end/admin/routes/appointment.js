import express from "express"
import {
  createAppointment,
  getBookedTimes,
  getAllAppointments,
  getAppointmentsByStatus,
  updateAppointmentStatus,
  getAppointmentById,
  getAppointmentStats,
  getDashboardStats,
} from "../controllers/appointmentController.js"

const router = express.Router()

// Public routes
router.post("/", createAppointment) // form submission
router.get("/booked/:date", getBookedTimes) // disable taken slots

// Admin routes
router.get("/all", getAllAppointments) // Get all appointments
router.get("/status/:status", getAppointmentsByStatus) // Get appointments by status
router.get("/stats", getAppointmentStats) // Get appointment statistics
router.get("/dashboard-stats", getDashboardStats) // Get dashboard statistics
router.get("/:id", getAppointmentById) // Get single appointment
router.put("/:id/status", updateAppointmentStatus) // Update appointment status

export default router
