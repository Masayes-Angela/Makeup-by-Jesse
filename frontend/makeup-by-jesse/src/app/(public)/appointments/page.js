'use client';

import { useState } from 'react';
import Calendar from './components/Calendar';
import TimeSelector from './components/TimeSelector';
import styles from '../styles/appointments.module.css';

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.headingSection}>
        <h2 className={styles.title}>Make an Appointment</h2>
        <p className={styles.subtext}>
          Check our availability and book the date and time that works for you!
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.calendarWrap}>
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        <div className={styles.timeWrap}>
          <TimeSelector selectedDate={selectedDate} />
        </div>
      </div>
    </section>
  );
}
