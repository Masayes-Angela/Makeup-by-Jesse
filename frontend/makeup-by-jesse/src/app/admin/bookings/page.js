'use client';

import { useState } from 'react';
import styles from './bookings.module.css';
import { HiBookmark } from 'react-icons/hi2';
import { MdOutlineEventNote } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';
import {
  useGetAllAppointmentsQuery,
  useGetAppointmentStatsQuery,
  useUpdateAppointmentStatusMutation,
} from '@/rtk/appointmentsApi';

export default function ManageBookings() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState('');

  const { data: appointments = [], isLoading, error, refetch } = useGetAllAppointmentsQuery();
  const { data: stats = {} } = useGetAppointmentStatsQuery();
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  const openDetailsModal = (booking) => setSelectedBooking(booking);
  const closeModal = () => {
    setSelectedBooking(null);
    setActionType('');
  };

  const openConfirmation = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const confirmAction = async () => {
    if (!selectedBooking) return;

    try {
      const newStatus = actionType === 'Accept' ? 'Confirmed' : 'Declined';
      await updateAppointmentStatus({ id: selectedBooking.id, status: newStatus }).unwrap();
      refetch();
      closeModal();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const tabs = ['Pending', 'Confirmed', 'Declined', 'Cancelled'];
  const filteredBookings = appointments.filter((b) => b.status === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

const formatTime = (timeString) => {
  if (!timeString) return '—';
  if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
    return timeString.toUpperCase();
  }

  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

  if (isLoading) {
    return (
      <div className={styles.bookingsWrapper}>
        <div className={styles['bookings-heading']}>
          <div className={styles.container}>
            <div className={styles['icon-container']}>
              <HiBookmark />
            </div>
            <h1>Manage Bookings</h1>
          </div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.bookingsWrapper}>
        <div className={styles['bookings-heading']}>
          <div className={styles.container}>
            <div className={styles['icon-container']}>
              <HiBookmark />
            </div>
            <h1>Manage Bookings</h1>
          </div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          Error loading appointments: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingsWrapper}>
      <div className={styles['bookings-heading']}>
        <div className={styles.container}>
          <div className={styles['icon-container']}>
            <HiBookmark />
          </div>
          <h1>Manage Bookings</h1>
        </div>
      </div>

      <h2 className={styles.statsHeading}>Quick Stats</h2>
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Total Bookings</p>
          <h2 className={styles.statValue}>
            {appointments.filter((b) => b.status === 'Confirmed').length}
          </h2>
        </div>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Pending Approval</p>
          <h2 className={`${styles.statValue} ${styles.pending}`}>{stats.pending || 0}</h2>
        </div>
      </div>

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

      <div className={styles.cardsGrid}>
        {filteredBookings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No {activeTab.toLowerCase()} appointments found.
          </div>
        ) : (
          filteredBookings.map((booking) =>
            activeTab === 'Pending' ? (
              <div className={styles.card} key={booking.id}>
                <div className={styles.cardHeader}>
                  <strong className={styles.clientName}>{booking.full_name}</strong>
                  <button className={styles.detailsBtn} onClick={() => openDetailsModal(booking)}>
                    Details
                  </button>
                </div>
                <p className={styles.metaLabel}>Event</p>
                <p className={styles.metaValue}>{booking.event_type}</p>

                <div className={styles.dateTime}>
                  <div>
                    <p className={styles.metaLabel}>Date</p>
                    <p className={styles.metaValue}>{formatDate(booking.appointment_date)}</p>
                  </div>
                  <div>
                    <p className={styles.metaLabel}>Time</p>
                    <p className={styles.metaValue}>{formatTime(booking.appointment_time)}</p>
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
              <div className={styles.horizontalCard} key={booking.id}>
                <div className={styles.sideBar}></div>
                <div className={styles.cardBody}>
                  <div className={styles.timeDate}>
                    <strong>{formatTime(booking.appointment_time)}</strong>
                    <p>{formatDate(booking.appointment_date)}</p>
                  </div>

                  <div className={styles.clientInfo}>
                    <div className={styles.columnLeft}>
                      <p className={styles.clientName}>{booking.full_name}</p>
                      <p className={styles.email}>{booking.email}</p>
                    </div>
                    <div className={styles.columnRight}>
                      <p className={styles.event}>
                        <MdOutlineEventNote className={styles.icon} />
                        {booking.event_type}
                      </p>
                      <p className={styles.location}>
                        <IoLocationSharp className={styles.icon} />
                        {booking.address_line}, {booking.barangay}, {booking.city}, {booking.province}
                      </p>
                    </div>
                  </div>

                  <div className={styles.actionRight}>
                    <button className={styles.viewBtn} onClick={() => openDetailsModal(booking)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>

      {selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {!actionType && (
              <button className={styles.closeIcon} onClick={closeModal}>
                ×
              </button>
            )}

            {actionType ? (
              <>
                <h3 className={styles.modalTitle}>Confirm {actionType === 'Accept' ? 'Acceptance' : 'Rejection'}</h3>
                <p>Are you sure you want to {actionType.toLowerCase()} this booking?</p>
                <div className={styles.modalActions}>
                  <button className={styles.closeBtn} onClick={closeModal}>
                    Cancel
                  </button>
                  <button className={styles.confirmBtn} onClick={confirmAction}>
                    Yes, {actionType}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.detailsContent}>
                <h3 className={styles.modalTitle}>Booking Details</h3>
                <p><strong>Full Name:</strong> {selectedBooking.full_name}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>
                <p><strong>Event:</strong> {selectedBooking.event_type}</p>
                <p><strong>Mode of Payment:</strong> {selectedBooking.payment_mode}</p>
                <p><strong>Date:</strong> {formatDate(selectedBooking.appointment_date)}</p>
                <p><strong>Time:</strong> {formatTime(selectedBooking.appointment_time)}</p>
                <p><strong>Address:</strong> {selectedBooking.address_line}, {selectedBooking.barangay}, {selectedBooking.city}, {selectedBooking.province}</p>
                {selectedBooking.address_note && (
                  <p><strong>Address Note:</strong> {selectedBooking.address_note}</p>
                )}
                {selectedBooking.message && (
                  <p><strong>Message:</strong> {selectedBooking.message}</p>
                )}
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}