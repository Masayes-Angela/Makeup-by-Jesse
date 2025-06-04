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
        <h2 className={styles.logo}>admin.</h2>
      </div>
      <ul className={styles['sidebar-menu']}>
        <li className={pathname === '/admin/dashboard' ? styles.active : ''}>
          <Link href="/admin/dashboard">
            <RxDashboard className={styles.icon} />
            <span className={styles.linkText}>Dashboard</span>
          </Link>
        </li>
        <li className={pathname === '/admin/bookings' ? styles.active : ''}>
          <Link href="/admin/bookings">
            <HiOutlineBookmark className={styles.icon} />
            <span className={styles.linkText}>Manage Bookings</span>
          </Link>
        </li>
        <li className={pathname === '/admin/schedule' ? styles.active : ''}>
          <Link href="/admin/schedule">
            <FaRegCalendar className={styles.icon} />
            <span className={styles.linkText}>Schedule</span>
          </Link>
        </li>
        <li className={pathname === '/admin/manage-content' ? styles.active : ''}>
          <Link href="/admin/manage-content">
            <LuPencilLine className={styles.icon} />
            <span className={styles.linkText}>Manage Website Content</span>
          </Link>
        </li>
        <li className={pathname === '/admin/settings' ? styles.active : ''}>
          <Link href="/admin/settings">
            <FiSettings className={styles.icon} />
            <span className={styles.linkText}>Settings</span>
          </Link>
        </li>
      </ul>

      <div className={styles['sidebar-footer']}>
        <Link href="/admin/logout">
          <TbLogout className={styles.logoutIcon} />
          <span className={styles.linkText}>Logout</span>
        </Link>
      </div>
    </div>
  );
}