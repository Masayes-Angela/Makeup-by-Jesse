//db table: appointments
import db from "../../db.js";

// Create appointment
export const createAppointment = async (req, res) => {
  const {
    user_id,
    full_name,
    email,
    event_type,
    payment_mode,
    appointment_date,
    appointment_time,
    address_line,
    barangay,
    city,
    province,
    address_note,
    message
  } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status IN ('Pending', 'Confirmed')",
      [appointment_date, appointment_time]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "This slot is already booked." });
    }

    const [result] = await db.query(
      `INSERT INTO appointments (
        user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line,
        barangay, city, province, address_note, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line,
        barangay, city, province, address_note, message
      ]
    );

    res.status(201).json({ message: "Appointment submitted", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get booked times for a specific date
export const getBookedTimes = async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status IN ('Pending', 'Confirmed')",
      [date]
    );
    const booked = rows.map(row => row.appointment_time);
    res.json(booked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};