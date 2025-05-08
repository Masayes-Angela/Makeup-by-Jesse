'use client';

import { useState } from 'react';
import styles from './schedule.module.css';

export default function Schedule() {
  // Current date state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sample appointment data
  const appointments = {
    "2025-04-11": [
      { time: "8:00 AM", name: "Angela Beatrice Masayes" },
      { time: "2:00 PM", name: "Regine Velasquez" }
    ],
    "2025-04-12": [
      { time: "7:00 AM", name: "Angeline Quinto" },
      { time: "1:00 PM", name: "Angel's Burger" },
      { time: "5:00 PM", name: "Regine Velasquez" }
    ]
  };

  // Calendar utility functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Format date as YYYY-MM-DD for lookup in appointments
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Navigation between months
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get appointments for selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const todayAppointments = appointments[selectedDateKey] || [];
  
  // Get tomorrow's date for upcoming appointments section
  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateKey = formatDateKey(tomorrow);
  
  // Calendar rendering
  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    let calendar = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
    }
    
    // Add cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const hasAppointments = appointments[dateKey] && appointments[dateKey].length > 0;
      
      const isSelected = day === selectedDate.getDate() && 
                         month === selectedDate.getMonth() && 
                         year === selectedDate.getFullYear();
      
      calendar.push(
        <div 
          key={day}
          className={`${styles.calendarDay} ${isSelected ? styles.selected : ''} ${hasAppointments ? styles.hasAppointments : ''}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
          {hasAppointments && <div className={styles.appointmentDot}></div>}
        </div>
      );
    }
    
    return calendar;
  };

  const formatDisplayDate = (date) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${weekdays[date.getDay()]}, ${date.getDate()}`;
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.sidebar}>
        <div className={styles.iconWrapper}>
          <div className={styles.scheduleIcon}></div>
          <span>Schedule</span>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.scheduleHeader}>
          <h1>Today's schedule</h1>
          <h2>{formatDisplayDate(selectedDate)}</h2>
        </div>
        
        <div className={styles.scheduleFlex}>
          <div className={styles.leftSection}>
            <div className={styles.upcomingCard}>
              <h3>Upcoming Appointments</h3>
              <div className={styles.upcomingList}>
                <h4>April {tomorrow.getDate()}</h4>
                <ul>
                  {appointments[tomorrowDateKey]?.map((appointment, idx) => (
                    <li key={idx}>
                      {appointment.time} - {appointment.name}
                    </li>
                  ))}
                  {!appointments[tomorrowDateKey] && <li>No appointments</li>}
                </ul>
              </div>
            </div>
            
            <div className={styles.calendarSection}>
              <div className={styles.calendarHeader}>
                <h3>{months[currentDate.getMonth()]}, {currentDate.getFullYear()}</h3>
                <div className={styles.calendarNav}>
                  <button onClick={prevMonth} className={styles.navButton}>&lt;</button>
                  <button onClick={nextMonth} className={styles.navButton}>&gt;</button>
                </div>
              </div>
              <div className={styles.calendarGrid}>
                {days.map(day => (
                  <div key={day} className={styles.calendarDay}>{day}</div>
                ))}
                {renderCalendar()}
              </div>
            </div>
          </div>
          
          <div className={styles.rightSection}>
            <div className={styles.appointmentsContainer}>
              {todayAppointments.map((appointment, idx) => (
                <div key={idx} className={styles.appointmentCard}>
                  <div className={styles.appointmentInfo}>
                    <span className={styles.appointmentName}>{appointment.name}</span>
                    <span className={styles.appointmentTime}>{appointment.time}</span>
                  </div>
                </div>
              ))}
              
              <div className={styles.adminNotesCard}>
                <h3>Admin scheduling notes</h3>
                <div className={styles.pagination}>
                  <div className={styles.paginationDot + ' ' + styles.activeDot}></div>
                  <div className={styles.paginationDot}></div>
                  <div className={styles.paginationDot}></div>
                </div>
              </div>
            </div>
            
            <div className={styles.appointmentDetails}>
              <h3>Appointment Details</h3>
              <div className={styles.detailsContent}>
                <p>Choose an appointment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}