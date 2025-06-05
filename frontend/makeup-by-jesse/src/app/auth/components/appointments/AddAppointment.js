// CRUD for appointments and fetch appointments for a user
"use client"

import { useState, useEffect } from "react"
import { useGetUserAppointmentsQuery } from "@/rtk/appointmentsApi"
import styles from "./AddAppointment.module.css"

export default function AddAppointment() {
  const [userId, setUserId] = useState(null)
  const [filter, setFilter] = useState("all") // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    // Get user ID from localStorage
    const id = localStorage.getItem("userId")
    if (id) {
      setUserId(id)
    }
  }, [])

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useGetUserAppointmentsQuery(userId, {
    skip: !userId,
  })

  // Filter appointments based on status
  const filteredAppointments = appointments
    ? appointments.filter((appointment) => {
        if (filter === "all") return true
        return appointment.status.toLowerCase() === filter
      })
    : []

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <div>Loading appointments...</div>
  }

  if (error) {
    return <div>Error loading appointments: {error.message}</div>
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Appointments</h2>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "pending" ? styles.active : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "confirmed" ? styles.active : ""}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "completed" ? styles.active : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "cancelled" ? styles.active : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className={styles.appointmentList}>
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.appointmentCard}>
              <div className={styles.appointmentHeader}>
                <h3>{appointment.event_type}</h3>
                <span className={`${styles.status} ${styles[appointment.status.toLowerCase()]}`}>
                  {appointment.status}
                </span>
              </div>
              <div className={styles.appointmentDetails}>
                <p>
                  <strong>Date:</strong> {formatDate(appointment.appointment_date)}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.appointment_time}
                </p>
                <p>
                  <strong>Location:</strong> {appointment.address_line}, {appointment.city}
                </p>
                <p>
                  <strong>Payment:</strong> {appointment.payment_mode}
                </p>
              </div>
              {appointment.status === "Pending" && (
                <div className={styles.appointmentActions}>
                  <button className={styles.cancelBtn}>Cancel Appointment</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
