"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Calendar from "./components/Calendar"
import TimeSelector from "./components/TimeSelector"
import styles from "../styles/appointments.module.css"

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const router = useRouter()

  // Function to handle appointment booking
  const handleGetAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time for your appointment.")
      return
    }

    // Store selected date and time in localStorage
    localStorage.setItem("selectedDate", selectedDate)
    localStorage.setItem("selectedTime", selectedTime)

    // Navigate to the appointment form page
    router.push("/appointments/form")
  }

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.headingSection}>
        <h2 className={styles.title}>Make an Appointment</h2>
        <p className={styles.subtext}>Check our availability and book the date and time that works for you!</p>
      </div>

      <div className={styles.container}>
        <div className={styles.calendarWrap}>
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        <div className={styles.timeWrap}>
          <TimeSelector selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className={styles.buttonContainer}>
          <button className={styles.getAppointmentBtn} onClick={handleGetAppointment}>
            Get Appointment
          </button>
        </div>
      )}
    </section>
  )
}
