'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from './components/Calendar'
import TimeSelector from './components/TimeSelector'
import styles from '../styles/appointments.module.css'
import { useSelector } from 'react-redux'
import { FaSpinner } from 'react-icons/fa'

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoggedIn) {
      router.push('/auth/login?redirect=/appointments')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  const handleGetAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and time for your appointment.')
      return
    }

    setIsRedirecting(true)
    localStorage.setItem('selectedDate', selectedDate)
    localStorage.setItem('selectedTime', selectedTime)

    setTimeout(() => {
      router.push('/appointments/form')
    }, 600)
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

      <div className={styles.buttonContainer}>
        <button
          className={styles.getAppointmentBtn}
          onClick={handleGetAppointment}
          disabled={!selectedDate || !selectedTime || isRedirecting}
        >
          {isRedirecting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaSpinner className={styles.spinner} />
              Loading
            </span>
          ) : (
            'Get Appointment'
          )}
        </button>
      </div>
    </section>
  )
}