'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TimeSelector.module.css';
import { mockTimeData } from '../data/mockTimeData';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TimeSelector({ selectedDate }) {
  const router = useRouter();
  const info = mockTimeData[selectedDate];
  const [selectedTime, setSelectedTime] = useState('');
  const [period, setPeriod] = useState('AM');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate]);

  const isFullyBooked = info?.status === 'full';
  const bookedTimes = Array.isArray(info?.bookedTimes)
    ? info.bookedTimes.map(item => item.time)
    : [];

  const amTimes = [
    '4:00', '4:30',
    '5:00', '5:30',
    '6:00', '6:30',
    '7:00', '7:30',
    '8:00', '8:30',
    '9:00', '9:30',
    '10:00', '10:30',
    '11:00', '11:30'];
  const pmTimes = [
    '12:00', '12:30',
    '1:00', '1:30',
    '2:00', '2:30',
    '3:00', '3:30',
    '4:00', '4:30',
    '5:00', '5:30',
    '6:00', '6:30',
    '7:00', '7:30',
    '8:00', '8:30',
    '9:00', '9:30',
  ];

  const displayedTimes = period === 'AM' ? amTimes : pmTimes;

  const handleSelectTime = (time) => {
    const formatted = `${time} ${period}`;
    const isTimeBooked = bookedTimes.includes(formatted);
    if (!isTimeBooked) {
      setSelectedTime(prev => prev === formatted ? '' : formatted);
    }
  };

  const handleTogglePeriod = () => {
    setPeriod(prev => (prev === 'AM' ? 'PM' : 'AM'));
    setSelectedTime('');
  };

  const handleConfirmClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleProceed = () => {
    setShowModal(false);
    const dateParam = encodeURIComponent(selectedDate);
    const timeParam = encodeURIComponent(selectedTime);
    router.push(`/appointments/form?date=${dateParam}&time=${timeParam}`); // ✅ redirect with query params
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Select Time</p>
      <div className={styles.card}>
        {selectedDate ? (
          <>
            <p className={styles.dateText}>
              {new Date(selectedDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>

            {bookedTimes.length > 0 && (
              <div className={styles.bookedList}>
                {bookedTimes.map((time, idx) => (
                  <p key={idx} className={styles.booked}>
                    {time} <span>is already booked</span>
                  </p>
                ))}
              </div>
            )}

            {!isFullyBooked && (
              <div className={styles.timeSection}>
                <div className={styles.periodHeader}>
                  <FaChevronLeft onClick={handleTogglePeriod} className={styles.arrow} />
                  <span>{period}</span>
                  <FaChevronRight onClick={handleTogglePeriod} className={styles.arrow} />
                </div>

                <div className={styles.grid}>
                  {displayedTimes.map((time, idx) => {
                    const fullTime = `${time} ${period}`;
                    const isTimeBooked = bookedTimes.includes(fullTime);
                    const isSelected = selectedTime === fullTime;

                    return (
                      <button
                        key={idx}
                        className={`${styles.timeBtn} ${isSelected ? styles.selected : ''}`}
                        onClick={() => handleSelectTime(time)}
                        disabled={isTimeBooked}
                      >
                        {time} <span className={styles.meridiem}>{period}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>Please select a date</p>
        )}
      </div>

      {!isFullyBooked && selectedTime && (
        <div className={styles.centerBtnWrapper}>
          <button className={styles.confirmBtn} onClick={handleConfirmClick}>
            Get Appointment
          </button>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Appointment</h3>
            <p>Date: <strong>{selectedDate}</strong></p>
            <p>Time: <strong>{selectedTime}</strong></p>
            <div className={styles.modalActions}>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleProceed}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}