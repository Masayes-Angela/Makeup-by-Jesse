'use client'

import styles from './dashboard.module.css'
import { FaThLarge } from 'react-icons/fa'

export default function DashboardPage() {
  const reminders = [
    { icon: '❗', label: 'Booking Reminder', text: 'Lorem ipsum neto higuyi iya' },
    { icon: '❗', label: 'Upcoming Booking', text: 'Lorem ipsum neto higuyi iya' },
    { icon: '❗', label: 'New Booking Request', text: 'Lorem ipsum neto higuyi iya' },
    { icon: '❗', label: 'Booking Canceled', text: 'Lorem ipsum neto higuyi iya' },
  ]

  return (
    <div className={styles.dashboardWrapper}>
      {/* Heading */}
      <div className={styles.dashboardHeader}>
        <div className={styles.container}>
          <div className={styles['icon-container']}>
            <FaThLarge />
          </div>
          <h1>Dashboard</h1>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.gridLayout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={styles.topRow}>
            <div className={styles.card}>
              <h2>Pending Requests</h2>
              <p className={styles.highlight}>19</p>    
            </div>
            <div className={styles.card}>
              <h2>Total Clients</h2>
              <p className={styles.highlight}>4,685</p>
            </div>
          </div>

          <div className={styles.clientsThisMonth}>
            <div className={styles.clientsHeader}>
              <span>👤 Clients</span>
              <span className={styles.monthTag}>this month</span>
            </div>
            <p className={styles.highlight}>143</p>
          </div>

          <div className={styles.staticBox}>
            <p><strong>Title</strong> | Details here</p>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.greetingCard}>
            <p>hello,<br /><strong>Ms. Jesse!</strong></p>
            <div className={styles.dots}>
              <span className={styles.active}></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className={styles.reminders}>
            <h2 className={styles.remindersTitle}>Reminders</h2>
            <ul>
              {reminders.map((item, index) => (
                <li key={index}>
                  <span className={styles.reminderIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.reminderLabel}>{item.label}</div>
                    <div className={styles.reminderText}>{item.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
