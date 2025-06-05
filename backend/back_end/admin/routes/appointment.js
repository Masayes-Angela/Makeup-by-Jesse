import express from "express";
import {
  createAppointment,
  getBookedTimes
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment); // form submission
router.get("/booked/:date", getBookedTimes); // disable taken slots

export default router;
