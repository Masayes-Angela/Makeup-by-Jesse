"use client"

import { useState, useEffect } from "react"
import styles from "./TimeSelector.module.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useGetBookedTimesQuery } from "@/rtk/appointmentsApi"

export default function TimeSelector({ selectedDate, selectedTime, setSelectedTime }) {
  const [currentPeriod, setCurrentPeriod] = useState("AM")
  const [displayDate, setDisplayDate] = useState("")

  // Fetch booked times for the selected date
  const { data: bookedTimes, isLoading } = useGetBookedTimesQuery(selectedDate, {
    skip: !selectedDate,
  })

  // Format display date
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      const options = { weekday: "long", day: "numeric", month: "long" }
      setDisplayDate(date.toLocaleDateString("en-US", options))
    }
  }, [selectedDate])

  // Generate time slots based on period
  const getTimeSlots = () => {
    const slots = []
    if (currentPeriod === "AM") {
      // 4:00 AM to 11:30 AM
      for (let hour = 4; hour <= 11; hour++) {
        for (let minute = 0; minute <= 30; minute += 30) {
          const formattedHour = hour
          const formattedMinute = minute === 0 ? "00" : minute
          const time = `${formattedHour}:${formattedMinute} AM`
          slots.push(time)
        }
      }
    } else {
      // 12:00 PM to 11:30 PM (if you want PM slots)
      for (let hour = 12; hour <= 23; hour++) {
        for (let minute = 0; minute <= 30; minute += 30) {
          const displayHour = hour > 12 ? hour - 12 : hour
          const formattedMinute = minute === 0 ? "00" : minute
          const time = `${displayHour}:${formattedMinute} PM`
          slots.push(time)
        }
      }
    }
    return slots
  }

  const timeSlots = getTimeSlots()

  const handleTimeSelect = (time) => {
    if (typeof setSelectedTime === "function") {
      setSelectedTime(time)
      // Store in localStorage for the form page
      localStorage.setItem("selectedTime", time)
    } else {
      console.error("setSelectedTime is not a function")
    }
  }

  const handlePeriodChange = (period) => {
    setCurrentPeriod(period)
  }

  // Check if a time slot is booked
  const isTimeBooked = (time) => {
    return bookedTimes?.includes(time)
  }

  if (!selectedDate) {
    return (
      <div className={styles.container}>
        <p className={styles.title}>Select Time</p>
        <div className={styles.emptyState}>
          <p>Please select a date first</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>Select Time</p>

      <div className={styles.dateDisplay}>
        <h3>{displayDate}</h3>

        {/* Period selector */}
        <div className={styles.periodSelector}>
          <button className={styles.navBtn} onClick={() => handlePeriodChange("AM")} disabled={currentPeriod === "AM"}>
            <FaChevronLeft />
          </button>
          <span className={styles.periodText}>{currentPeriod}</span>
          <button className={styles.navBtn} onClick={() => handlePeriodChange("PM")} disabled={currentPeriod === "PM"}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.timeGrid}>
        {isLoading ? (
          <div className={styles.loading}>Loading available times...</div>
        ) : (
          timeSlots.map((time) => {
            const booked = isTimeBooked(time)
            return (
              <button
                key={time}
                className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ""} ${booked ? styles.booked : ""}`}
                onClick={() => !booked && handleTimeSelect(time)}
                disabled={booked}
              >
                {time}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
