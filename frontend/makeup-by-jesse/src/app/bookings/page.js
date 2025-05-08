'use client';

import { useState } from 'react';
import styles from './bookings.module.css';

export default function ManageBookings() {
  const [activeTab, setActiveTab] = useState('Pending');
  
  const tabs = ['Pending', 'Confirmed', 'Declined', 'Canceled'];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <div className={styles.icon}>
            <span className={styles.iconSymbol}>📋</span>
          </div>
        </div>
        <h1 className={styles.title}>Manage Bookings</h1>
      </div>
      
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} {tab === 'Pending' && <span className={styles.count}>(8)</span>}
          </button>
        ))}
      </div>
      
      <div className={styles.contentContainer}>
        {/* Content will be empty as requested */}
      </div>
    </div>
  );
}