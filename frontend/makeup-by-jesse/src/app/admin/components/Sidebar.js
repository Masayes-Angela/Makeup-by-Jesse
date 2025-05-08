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
        <li className={pathname === '/admin/dashboard' ? styles.active : ''}>
          <Link href="/admin/dashboard">
            <FaTachometerAlt className={styles.icon}/> Dashboard
          </Link>
        </li>
        <li className={pathname === '/admin/bookings' ? styles.active : ''}>
          <Link href="/admin/bookings">
            <FaBookmark className={styles.icon}/> Manage Bookings
          </Link>
        </li>
        <li className={pathname === '/admin/schedule' ? styles.active : ''}>
          <Link href="/admin/schedule">
            <FaCalendarAlt className={styles.icon}/> Schedule
          </Link>
        </li>
        <li className={pathname === '/admin/content' ? styles.active : ''}>
          <Link href="/admin/content">
            <FaEdit className={styles.icon}/> Manage Website Content
          </Link>
        </li>
        <li className={pathname === '/admin/settings' ? styles.active : ''}>
          <Link href="/admin/settings">
            <FaCog className={styles.icon}/> Settings
          </Link>
        </li>
      </ul>
      <div className={styles['sidebar-footer']}>
        <Link href="/admin/logout">
          <FaSignOutAlt className={styles['logout-icon']}/> Logout
        </Link>
      </div>
    </div>
  );
}