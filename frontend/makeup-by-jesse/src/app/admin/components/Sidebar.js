'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';
import { HiOutlineBookmark } from "react-icons/hi";
import { LuPencilLine } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem('adminToken');
    setShowModal(false);
    router.push('/auth/login');
  };

  return (
    <>
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

        <div className={styles['sidebar-footer']} onClick={() => setShowModal(true)}>
          <TbLogout className={styles.logoutIcon} />
          <span className={styles.linkText}>Logout</span>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalText}>Are you sure you want to log out?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={confirmLogout}>Yes</button>
              <button className={styles.modalBtn} onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}