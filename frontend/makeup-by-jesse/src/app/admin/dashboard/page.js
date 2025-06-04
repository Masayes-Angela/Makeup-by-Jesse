'use client'
import { useEffect, useState } from 'react'
import styles from './dashboard.module.css'
import { RxDashboard } from 'react-icons/rx'
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    // Simulate API fetch
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(() => {
        const today = new Date()
        const month = today.getMonth()
        setDashboardData({
          pendingRequests: 19,
          totalClients: 4685,
          clientsThisMonth: 143,
          greetingName: 'Ms. Jesse',
          reminders: [
            { label: 'Booking Reminder', note: 'Lorem ipsum neto higugi iya', icon: '!' },
            { label: 'Upcoming Booking', note: 'Lorem ipsum neto higugi iya', icon: '!' },
            { label: 'New Booking Request', note: 'Lorem ipsum neto higugi iya', icon: '!' },
            { label: 'Booking Canceled', note: 'Lorem ipsum neto higugi iya', icon: '!' },
          ]
        })
      })
  }, [])

  if (!dashboardData) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.gridLeft}>
          <div className={styles.skeletonWrapper}>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
          </div>
        </div>

        <div className={styles.reminderBox}>
          <h3>Reminders</h3>
          <div className={styles.skeletonWrapper}>
            <div className={styles.skeletonReminder}></div>
            <div className={styles.skeletonReminder}></div>
            <div className={styles.skeletonReminder}></div>
          </div>
        </div>
      </main>
    )
  }

  const { pendingRequests, totalClients, clientsThisMonth, greetingName, reminders } = dashboardData

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles['dashboard-heading']}>
        <div className={styles.container}>
          <div className={styles['icon-container']}>
            <RxDashboard />
          </div>
          <h1>Dashboard Overview</h1>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.gridLeft}>
          <div className={styles.welcomeBox}>
            <h3>hello,</h3>
            <h2>{greetingName}!</h2>
          </div>

          <div className={styles.rowCards}>
            <div className={styles.card1}>
              <div className={styles.cardContent}>
                <p>Pending Requests</p>
                <h2>{pendingRequests}</h2>
              </div>
              <FaArrowTrendUp className={styles.cardIcon} />
            </div>

            <div className={styles.card2}>
              <div className={styles.cardContent}>
                <p>Total Clients</p>
                <h2>{totalClients.toLocaleString()}</h2>
              </div>
              <FaArrowTrendUp className={styles.cardIcon} />
            </div>
          </div>

          <div className={styles.monthlyBox}>
            <p className={styles.monthlyLabel}>
              <MdOutlinePersonOutline className={styles.icon} />
              Clients <span className={styles.subText}>| this month</span>
            </p>
            <h2>{clientsThisMonth}</h2>
          </div>
        </div>

        <div className={styles.reminderBox}>
          <h3>Reminders</h3>
          <ul>
            {reminders.map((item, index) => (
              <li key={index} className={styles.reminderItem}>
                <span className={styles.iconCircle}>{item.icon}</span>
                <div className={styles.reminderText}>
                  <strong>{item.label}</strong>
                  <p>{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
