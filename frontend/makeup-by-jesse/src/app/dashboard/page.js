'use client'
import { useEffect, useState } from 'react'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    // Simulate an API call (replace this part with actual fetch later)
    fetch('/api/dashboard') // example endpoint
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(() => {
        // fallback empty structure
        setDashboardData({
          pendingRequests: 0,
          totalClients: 0,
          clientsThisMonth: 0,
          greetingName: '',
          reminders: []
        })
      })
  }, [])

  if (!dashboardData) return <div className={styles.mainContent}>Loading...</div>

  const {
    pendingRequests,
    totalClients,
    clientsThisMonth,
    greetingName,
    reminders
  } = dashboardData

  return (
    <div className={styles.dashboardWrapper}>

      <main className={styles.mainContent}>
        <h1 className={styles.header}>Dashboard</h1>

        <div className={styles.topCards}>
          <div className={styles.card}>
            <p>Pending Requests</p>
            <h2>{pendingRequests}</h2>
          </div>
          <div className={styles.card}>
            <p>Total Clients</p>
            <h2>{totalClients.toLocaleString()}</h2>
          </div>
          <div className={styles.greetingCard}>
            <p>hello,</p>
            <h3>{greetingName}</h3>
          </div>
        </div>

        <div className={styles.midSection}>
          <div className={styles.clientsCard}>
            <p><span className={styles.icon}>👤</span> Clients | <span className={styles.subText}>this month</span></p>
            <h2>{clientsThisMonth}</h2>
          </div>

          <div className={styles.staticBox}>
            <p><strong>IDK</strong> | WALA PA</p>
          </div>

          <div className={styles.reminderBox}>
            <h3>Reminders</h3>
            <ul>
              {reminders.map((item, index) => (
                <li key={index}>
                  <span className={styles.exclamation}>{item.icon}</span> {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}