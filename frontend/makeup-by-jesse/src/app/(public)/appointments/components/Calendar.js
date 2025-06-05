"use client"

import { useState } from "react"
import styles from "./Calendar.module.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useGetBookedTimesQuery } from "@/rtk/appointmentsApi"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Get Philippine time
const getPhilippineToday = () => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3600000 * 8)
}

export default function Calendar({ selectedDate, setSelectedDate }) {
  const today = getPhilippineToday()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [dateStatus, setDateStatus] = useState({})

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = (() => {
    const prevLastDay = new Date(year, month, 0).getDate()
    return Array.from({ length: firstDay }, (_, i) => prevLastDay - firstDay + i + 1)
  })()
  const totalSlots = firstDay + daysInMonth
  const nextMonthDays = Array.from({ length: 42 - totalSlots }, (_, i) => i + 1)

  // Fetch booked dates for the current month
  const currentMonthStr = `${year}-${String(month + 1).padStart(2, "0")}`
  const { data: bookedDates, isLoading } = useGetBookedTimesQuery(currentMonthStr, {
    // This is a placeholder - in a real implementation, you might want to
    // fetch all booked dates for the month in one call
    skip: true, // Skip automatic fetching, we'll handle it manually
  })

  // Check if a date is in the past
  const isPastDate = (day) => {
    const date = new Date(year, month, day)
    return date < today
  }

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((prev) => prev - 1)
    } else {
      setMonth((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (month === 11) {
      setMonth(0)
      setYear((prev) => prev + 1)
    } else {
      setMonth((prev) => prev + 1)
    }
  }

  const handleSelect = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formatted)
    // Store in localStorage for the form page
    localStorage.setItem("selectedDate", formatted)
  }

  return (
    <div>
      <p className={styles.title}>Select Date</p>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button className={styles.navBtn} onClick={handlePrev}>
            <FaChevronLeft />
          </button>
          <h4>
            {monthNames[month]} {year}
          </h4>
          <button className={styles.navBtn} onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        {/* Weekday headers */}
        <div className={styles.dayLabels}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className={styles.dayLabel}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Previous month tail */}
          {prevMonthDays.map((day) => (
            <div key={`prev-${day}`} className={styles.day} style={{ color: "#B3BCBD", pointerEvents: "none" }}>
              {day}
            </div>
          ))}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isDisabled = isPastDate(day)
            const targetDate = new Date(year, month, day)
            const isToday = targetDate.toDateString() === today.toDateString()
            const status = dateStatus[dateKey] || "available"

            return (
              <div
                key={`day-${day}`}
                className={`${styles.day} 
                  ${selectedDate === dateKey ? styles.selected : ""} 
                  ${isToday ? styles.today : ""}
                  ${isDisabled ? styles.disabled : ""}
                  ${status === "fully-booked" ? styles.fullyBooked : ""}`}
                onClick={() => !isDisabled && handleSelect(day)}
                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
              >
                {day}
              </div>
            )
          })}

          {/* Next month lead-in */}
          {nextMonthDays.map((day) => (
            <div key={`next-${day}`} className={styles.day} style={{ color: "#B3BCBD", pointerEvents: "none" }}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
