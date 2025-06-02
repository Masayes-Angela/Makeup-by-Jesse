'use client';

import { useState } from 'react';
import styles from './Calendar.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { mockTimeData } from '../data/mockTimeData';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Get Philippine time
const getPhilippineToday = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 8);
};

export default function Calendar({ selectedDate, setSelectedDate }) {
  const today = getPhilippineToday();
  const [month, setMonth] = useState(5); // Start at June
  const [year, setYear] = useState(2025);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = (() => {
    const prevLastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: firstDay }, (_, i) => prevLastDay - firstDay + i + 1);
  })();
  const totalSlots = firstDay + daysInMonth;
  const nextMonthDays = Array.from({ length: 42 - totalSlots }, (_, i) => i + 1);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  const handleSelect = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formatted);
  };

  return (
    <div>
      <p className={styles.title}>Select Date</p>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button className={styles.navBtn} onClick={handlePrev}>
            <FaChevronLeft />
          </button>
          <h4>{monthNames[month]} {year}</h4>
          <button className={styles.navBtn} onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        {/* Weekday headers */}
        <div className={styles.dayLabels}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className={styles.dayLabel}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Previous month tail */}
          {prevMonthDays.map(day => (
            <div key={`prev-${day}`} className={styles.day} style={{ color: '#B3BCBD', pointerEvents: 'none' }}>
              {day}
            </div>
          ))}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = mockTimeData[dateKey]?.status || 'none';

            const targetDate = new Date(year, month, day);
            const isToday = targetDate.toDateString() === today.toDateString();

            return (
              <div
                key={`day-${day}`}
                className={`${styles.day} ${styles[status]} 
                  ${selectedDate === dateKey ? styles.selected : ''} 
                  ${isToday ? styles.today : ''}`}
                onClick={() => handleSelect(day)}
              >
                {day}
              </div>
            );
          })}

          {/* Next month lead-in */}
          {nextMonthDays.map(day => (
            <div key={`next-${day}`} className={styles.day} style={{ color: '#B3BCBD', pointerEvents: 'none' }}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}