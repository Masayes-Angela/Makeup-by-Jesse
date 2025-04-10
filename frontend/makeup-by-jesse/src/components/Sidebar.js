'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaBookmark, FaCalendarAlt, FaEdit, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles['sidebar-header']}>
        <h2>admin.</h2>
      </div>
      <ul className={styles['sidebar-menu']}>
        <li className={pathname === '/dashboard' ? styles.active : ''}>
          <Link href="/dashboard">
            <FaTachometerAlt className={styles.icon}/> Dashboard
          </Link>
        </li>
        <li className={pathname === '/bookings' ? styles.active : ''}>
          <Link href="/bookings">
            <FaBookmark className={styles.icon}/> Manage Bookings
          </Link>
        </li>
        <li className={pathname === '/schedule' ? styles.active : ''}>
          <Link href="/schedule">
            <FaCalendarAlt className={styles.icon}/> Schedule
          </Link>
        </li>
        <li className={pathname === '/content' ? styles.active : ''}>
          <Link href="/content">
            <FaEdit className={styles.icon}/> Manage Website Content
          </Link>
        </li>
        <li className={pathname === '/settings' ? styles.active : ''}>
          <Link href="/settings">
            <FaCog className={styles.icon}/> Settings
          </Link>
        </li>
      </ul>
      <div className={styles['sidebar-footer']}>
        <Link href="/logout">
          <FaSignOutAlt className={styles['logout-icon']}/> Logout
        </Link>
      </div>
    </div>
  );
}