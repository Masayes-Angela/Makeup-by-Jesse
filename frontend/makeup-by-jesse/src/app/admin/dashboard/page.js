"use client"
import { useEffect, useState } from "react"
import styles from "./dashboard.module.css"
import { RxDashboard } from "react-icons/rx"
import { MdOutlinePersonOutline } from "react-icons/md"
import { FaArrowTrendUp } from "react-icons/fa6"
import { useGetDashboardStatsQuery } from "@/rtk/appointmentsApi"

export default function Dashboard() {
  const [greetingName, setGreetingName] = useState("Ms. Jesse")

  // Fetch dashboard statistics from the database
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery()

  useEffect(() => {
    // You can customize the greeting name based on admin info if needed
    const adminName = localStorage.getItem("adminName") || "Ms. Jesse"
    setGreetingName(adminName)
  }, [])

  // Generate reminders based on real appointment data
  const generateReminders = (data) => {
    if (!data) return []

    const reminders = []

    // Pending requests reminder
    if (data.pendingRequests > 0) {
      reminders.push({
        label: "Pending Requests",
        note: `You have ${data.pendingRequests} appointment${data.pendingRequests > 1 ? "s" : ""} waiting for approval`,
        icon: "!",
        type: "pending",
      })
    }

    // Upcoming appointments reminder
    if (data.recentAppointments && data.recentAppointments.length > 0) {
      const upcomingToday = data.recentAppointments.filter((apt) => {
        const today = new Date().toISOString().split("T")[0]
        return apt.appointment_date === today
      })

      if (upcomingToday.length > 0) {
        reminders.push({
          label: "Today's Appointments",
          note: `${upcomingToday.length} appointment${upcomingToday.length > 1 ? "s" : ""} scheduled for today`,
          icon: "📅",
          type: "today",
        })
      }

      // Next upcoming appointment
      const nextAppointment = data.recentAppointments[0]
      if (nextAppointment && nextAppointment.appointment_date !== new Date().toISOString().split("T")[0]) {
        const appointmentDate = new Date(nextAppointment.appointment_date)
        const formattedDate = appointmentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })

        reminders.push({
          label: "Next Appointment",
          note: `${nextAppointment.full_name} - ${nextAppointment.event_type} on ${formattedDate}`,
          icon: "⏰",
          type: "upcoming",
        })
      }
    }

    // Recent status changes
    if (data.recentStatusChanges && data.recentStatusChanges.length > 0) {
      const recentChange = data.recentStatusChanges[0]
      reminders.push({
        label: "Recent Update",
        note: `${recentChange.full_name}'s appointment was ${recentChange.status.toLowerCase()}`,
        icon: recentChange.status === "Confirmed" ? "✅" : recentChange.status === "Declined" ? "❌" : "🚫",
        type: "status",
      })
    }

    // Fill with default reminders if we have less than 4
    while (reminders.length < 4) {
      const defaultReminders = [
        {
          label: "System Update",
          note: "All systems running smoothly",
          icon: "ℹ️",
          type: "info",
        },
        {
          label: "Monthly Report",
          note: "Generate monthly appointment report",
          icon: "📊",
          type: "report",
        },
        {
          label: "Client Follow-up",
          note: "Follow up with recent clients",
          icon: "📞",
          type: "followup",
        },
        {
          label: "Schedule Review",
          note: "Review upcoming week's schedule",
          icon: "📋",
          type: "review",
        },
      ]

      const remainingSlots = 4 - reminders.length
      reminders.push(...defaultReminders.slice(0, remainingSlots))
    }

    return reminders.slice(0, 4) // Ensure we only return 4 reminders
  }

  if (isLoading) {
    return (
      <div className={styles.dashboardWrapper}>
        <div className={styles["dashboard-heading"]}>
          <div className={styles.container}>
            <div className={styles["icon-container"]}>
              <RxDashboard />
            </div>
            <h1>Dashboard Overview</h1>
          </div>
        </div>

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
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.dashboardWrapper}>
        <div className={styles["dashboard-heading"]}>
          <div className={styles.container}>
            <div className={styles["icon-container"]}>
              <RxDashboard />
            </div>
            <h1>Dashboard Overview</h1>
          </div>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
          Error loading dashboard data: {error.message}
        </div>
      </div>
    )
  }

  const { pendingRequests, totalClients, clientsThisMonth } = dashboardData || {}
  const reminders = generateReminders(dashboardData)

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles["dashboard-heading"]}>
        <div className={styles.container}>
          <div className={styles["icon-container"]}>
            <RxDashboard />
          </div>
          <h1>Dashboard Overview</h1>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.gridLeft}>
          <div className={styles.welcomeBox}>
            <h3>hello</h3>
            <h2>{greetingName}!</h2>
          </div>

          <div className={styles.rowCards}>
            <div className={styles.card1}>
              <div className={styles.cardContent}>
                <p>Pending Requests</p>
                <h2>{pendingRequests || 0}</h2>
              </div>
              <FaArrowTrendUp className={styles.cardIcon} />
            </div>

            <div className={styles.card2}>
              <div className={styles.cardContent}>
                <p>Total Clients</p>
                <h2>{totalClients ? totalClients.toLocaleString() : "0"}</h2>
              </div>
              <FaArrowTrendUp className={styles.cardIcon} />
            </div>
          </div>

          <div className={styles.monthlyBox}>
            <p className={styles.monthlyLabel}>
              <MdOutlinePersonOutline className={styles.icon} />
              Clients <span className={styles.subText}>| this month</span>
            </p>
            <h2>{clientsThisMonth || 0}</h2>
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
