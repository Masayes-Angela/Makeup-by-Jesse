"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./TimeSelector.module.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useGetBookedTimesQuery } from "@/rtk/appointmentsApi"

export default function TimeSelector({ selectedDate, selectedTime, setSelectedTime }) {
  const [currentPeriod, setCurrentPeriod] = useState("AM")
  const [displayDate, setDisplayDate] = useState("")
  const router = useRouter()

  const { data: bookedTimes, isLoading } = useGetBookedTimesQuery(selectedDate, {
    skip: !selectedDate,
  })

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      const options = { weekday: "long", day: "numeric", month: "long" }
      setDisplayDate(date.toLocaleDateString("en-US", options))
    }
  }, [selectedDate])

  const getTimeSlots = () => {
    const slots = []
    if (currentPeriod === "AM") {
      for (let hour = 4; hour <= 11; hour++) {
        for (let minute = 0; minute <= 30; minute += 30) {
          const formattedMinute = minute === 0 ? "00" : minute
          slots.push(`${hour}:${formattedMinute} AM`)
        }
      }
    } else {
      for (let hour = 12; hour <= 23; hour++) {
        for (let minute = 0; minute <= 30; minute += 30) {
          const displayHour = hour > 12 ? hour - 12 : hour
          const formattedMinute = minute === 0 ? "00" : minute
          slots.push(`${displayHour}:${formattedMinute} PM`)
        }
      }
    }
    return slots
  }

  const timeSlots = getTimeSlots()

  const handleTimeSelect = (time) => {
    if (typeof setSelectedTime === "function") {
      const isSameTime = selectedTime === time
      const newTime = isSameTime ? "" : time
      setSelectedTime(newTime)
      localStorage.setItem("selectedTime", newTime)
      localStorage.setItem("selectedDate", selectedDate)
    } else {
      console.error("setSelectedTime is not a function")
    }
  }

  const handlePeriodChange = (period) => {
    setCurrentPeriod(period)
  }

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

      <div className={styles.card}>
        <div className={styles.dateDisplay}>
          <h3>{displayDate}</h3>

          <div className={styles.periodSelector}>
            <button
              className={styles.navBtn}
              onClick={() => handlePeriodChange("AM")}
              disabled={currentPeriod === "AM"}
            >
              <FaChevronLeft />
            </button>
            <span className={styles.periodText}>{currentPeriod}</span>
            <button
              className={styles.navBtn}
              onClick={() => handlePeriodChange("PM")}
              disabled={currentPeriod === "PM"}
            >
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
                  className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ""} ${
                    booked ? styles.booked : ""
                  }`}
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
    </div>
  )
}