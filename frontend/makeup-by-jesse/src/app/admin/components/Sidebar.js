'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { FaRegCalendar, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineBookmark } from "react-icons/hi";
import { LuPencilLine } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";

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
            <RxDashboard className={styles.icon}/> Dashboard
          </Link>
        </li>
        <li className={pathname === '/admin/bookings' ? styles.active : ''}>
          <Link href="/admin/bookings">
            <HiOutlineBookmark className={styles.icon}/> Manage Bookings
          </Link>
        </li>
        <li className={pathname === '/admin/schedule' ? styles.active : ''}>
          <Link href="/admin/schedule">
            <FaRegCalendar className={styles.icon}/> Schedule
          </Link>
        </li>
        <li className={pathname === '/admin/content' ? styles.active : ''}>
          <Link href="/admin/content">
            <LuPencilLine className={styles.icon}/> Manage Website Content
          </Link>
        </li>
        <li className={pathname === '/admin/settings' ? styles.active : ''}>
          <Link href="/admin/settings">
            <FiSettings className={styles.icon}/> Settings
          </Link>
        </li>
      </ul>
      <div className={styles['sidebar-footer']}>
        <Link href="/admin/logout">
          <TbLogout className={styles['logout-icon']}/> Logout
        </Link>
      </div>
    </div>
  );
}