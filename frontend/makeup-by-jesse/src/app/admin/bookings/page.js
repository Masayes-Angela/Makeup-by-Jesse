'use client';

import { useState } from 'react';
import styles from './bookings.module.css';
import { HiBookmark } from "react-icons/hi2";
import initialBookings from './mockBookings';
import { MdOutlineEventNote } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

export default function ManageBookings() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState(''); // 'Accept' or 'Decline'

  const openDetailsModal = (booking) => setSelectedBooking(booking);
  const closeModal = () => {
    setSelectedBooking(null);
    setActionType('');
  };

  const openConfirmation = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const confirmAction = () => {
    if (!selectedBooking) return;
    const updated = bookings.map(b =>
      b === selectedBooking
        ? { ...b, status: actionType === 'Accept' ? 'Confirmed' : 'Declined' }
        : b
    );
    setBookings(updated);
    closeModal();
  };

  const tabs = ['Pending', 'Confirmed', 'Declined', 'Canceled'];
  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className={styles.bookingsWrapper}>
      {/* Heading */}
      <div className={styles['bookings-heading']}>
        <div className={styles.container}>
          <div className={styles['icon-container']}>
            <HiBookmark />
          </div>
          <h1>Manage Bookings</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <h2 className={styles.statsHeading}>Quick Stats</h2>
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Total Bookings</p>
          <h2 className={styles.statValue}>{bookings.length}</h2>
        </div>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Pending Approval</p>
          <h2 className={`${styles.statValue} ${styles.pending}`}>
            {bookings.filter(b => b.status === 'Pending').length}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className={styles.cardsGrid}>
        {filteredBookings.map((booking, index) => (
          activeTab === 'Pending' ? (
            <div className={styles.card} key={index}>
              <div className={styles.cardHeader}>
                <strong className={styles.clientName}>{booking.fullName}</strong>
                <button className={styles.detailsBtn} onClick={() => openDetailsModal(booking)}>Details</button>
              </div>
              <p className={styles.metaLabel}>Event</p>
              <p className={styles.metaValue}>{booking.event}</p>

              <div className={styles.dateTime}>
                <div>
                  <p className={styles.metaLabel}>Date</p>
                  <p className={styles.metaValue}>{booking.date}</p>
                </div>
                <div>
                  <p className={styles.metaLabel}>Time</p>
                  <p className={styles.metaValue}>{booking.time}</p>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.accept} onClick={() => openConfirmation(booking, 'Accept')}>
                  Accept Booking
                </button>
                <button className={styles.decline} onClick={() => openConfirmation(booking, 'Decline')}>
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.horizontalCard} key={index}>
              <div className={styles.sideBar}></div>
              <div className={styles.cardBody}>
                <div className={styles.timeDate}>
                  <strong>{booking.time}</strong>
                  <p>{booking.date}</p>
                </div>

                <div className={styles.clientInfo}>
                  <div className={styles.columnLeft}>
                    <p className={styles.clientName}>{booking.fullName}</p>
                    <p className={styles.email}>{booking.email}</p>
                  </div>
                  <div className={styles.columnRight}>
                    <p className={styles.event}>
                      <MdOutlineEventNote className={styles.icon} />
                      {booking.event}
                    </p>
                    <p className={styles.location}>
                      <IoLocationSharp className={styles.icon} />
                      {booking.addressLine}, {booking.barangay}, {booking.city}, {booking.province}
                    </p>
                  </div>
                </div>

                <div className={styles.actionRight}>
                  <button className={styles.viewBtn} onClick={() => openDetailsModal(booking)}>View Details</button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Detail or Confirmation Modal */}
      {selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {/* X Close Icon */}
            {!actionType && (
              <button className={styles.closeIcon} onClick={closeModal}>×</button>
            )}

            {actionType ? (
              <>
                <h3 className={styles.modalTitle}>Confirm {actionType === 'Accept' ? 'Acceptance' : 'Rejection'}</h3>
                <p>Are you sure you want to {actionType.toLowerCase()} this booking?</p>
                <div className={styles.modalActions}>
                  <button className={styles.closeBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.confirmBtn} onClick={confirmAction}>Yes, {actionType}</button>
                </div>
              </>
            ) : (
                <div className={styles.detailsContent}>
                  <h3 className={styles.modalTitle}>Booking Details</h3>
                  <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
                  <p><strong>Event:</strong> {selectedBooking.event}</p>
                  <p><strong>Mode of Payment:</strong> {selectedBooking.paymentMode}</p>
                  <p><strong>Address:</strong> {selectedBooking.addressLine}, {selectedBooking.barangay}, {selectedBooking.city}, {selectedBooking.province}</p>
                  {selectedBooking.addressNote && <p><strong>Note:</strong> {selectedBooking.addressNote}</p>}
                  {selectedBooking.message && <p><strong>Message:</strong> {selectedBooking.message}</p>}
                  <p><strong>Date:</strong> {selectedBooking.date}</p>
                  <p><strong>Time:</strong> {selectedBooking.time}</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}