//db table: appointments
import db from "../../db.js"

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
    message,
  } = req.body

  try {
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status IN ('Pending', 'Confirmed')",
      [appointment_date, appointment_time],
    )

    if (existing.length > 0) {
      return res.status(409).json({ error: "This slot is already booked." })
    }

    const [result] = await db.query(
      `INSERT INTO appointments (
        user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line,
        barangay, city, province, address_note, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        message,
      ],
    )

    res.status(201).json({ message: "Appointment submitted", id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get booked times for a specific date
export const getBookedTimes = async (req, res) => {
  const { date } = req.params
  try {
    const [rows] = await db.query(
      "SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status IN ('Pending', 'Confirmed')",
      [date],
    )
    const booked = rows.map((row) => row.appointment_time)
    res.json(booked)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all appointments (Admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id, user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line, barangay,
        city, province, address_note, message, status, created_at
      FROM appointments 
      ORDER BY created_at DESC`,
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get appointments by status (Admin only)
export const getAppointmentsByStatus = async (req, res) => {
  const { status } = req.params
  try {
    const [rows] = await db.query(
      `SELECT 
        id, user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line, barangay,
        city, province, address_note, message, status, created_at
      FROM appointments 
      WHERE status = ?
      ORDER BY created_at DESC`,
      [status],
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update appointment status (Admin only)
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const [result] = await db.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" })
    }

    res.json({ message: "Appointment status updated successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get appointment by ID (Admin only)
export const getAppointmentById = async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(
      `SELECT 
        id, user_id, full_name, email, event_type, payment_mode,
        appointment_date, appointment_time, address_line, barangay,
        city, province, address_note, message, status, created_at
      FROM appointments 
      WHERE id = ?`,
      [id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" })
    }

    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get appointment statistics (Admin only)
export const getAppointmentStats = async (req, res) => {
  try {
    const [totalResult] = await db.query("SELECT COUNT(*) as total FROM appointments")
    const [pendingResult] = await db.query("SELECT COUNT(*) as pending FROM appointments WHERE status = 'Pending'")
    const [confirmedResult] = await db.query(
      "SELECT COUNT(*) as confirmed FROM appointments WHERE status = 'Confirmed'",
    )
    const [declinedResult] = await db.query("SELECT COUNT(*) as declined FROM appointments WHERE status = 'Declined'")
    const [cancelledResult] = await db.query(
      "SELECT COUNT(*) as cancelled FROM appointments WHERE status = 'Cancelled'",
    )

    res.json({
      total: totalResult[0].total,
      pending: pendingResult[0].pending,
      confirmed: confirmedResult[0].confirmed,
      declined: declinedResult[0].declined,
      cancelled: cancelledResult[0].cancelled,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get dashboard statistics (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Get current month start and end dates
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Format dates for MySQL
    const formatDate = (date) => date.toISOString().split("T")[0]

    // Get pending requests
    const [pendingResult] = await db.query("SELECT COUNT(*) as pending FROM appointments WHERE status = 'Pending'")

    // Get total unique clients (users who have made appointments)
    const [totalClientsResult] = await db.query("SELECT COUNT(DISTINCT user_id) as total_clients FROM appointments")

    // Get clients this month (unique users who made appointments this month)
    const [monthlyClientsResult] = await db.query(
      "SELECT COUNT(DISTINCT user_id) as monthly_clients FROM appointments WHERE created_at >= ? AND created_at <= ?",
      [formatDate(currentMonthStart), formatDate(currentMonthEnd)],
    )

    // Get recent appointments for reminders
    const [recentAppointments] = await db.query(
      `SELECT 
        id, full_name, event_type, appointment_date, appointment_time, status, created_at
      FROM appointments 
      WHERE appointment_date >= CURDATE()
      ORDER BY appointment_date ASC, appointment_time ASC
      LIMIT 10`,
    )

    // Get recent status changes
    const [recentStatusChanges] = await db.query(
      `SELECT 
        id, full_name, event_type, appointment_date, appointment_time, status, created_at
      FROM appointments 
      WHERE status IN ('Confirmed', 'Declined', 'Cancelled')
      ORDER BY created_at DESC
      LIMIT 5`,
    )

    res.json({
      pendingRequests: pendingResult[0].pending,
      totalClients: totalClientsResult[0].total_clients,
      clientsThisMonth: monthlyClientsResult[0].monthly_clients,
      recentAppointments,
      recentStatusChanges,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
