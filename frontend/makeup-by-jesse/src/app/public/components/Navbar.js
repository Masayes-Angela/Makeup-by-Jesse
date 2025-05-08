'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Makeup <span>by Jesse</span></div>
      <ul className={styles.navLinks}>
        <li><a href="#hero">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About me</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><Link href="/faqs">FAQS</Link></li>

        {isLoggedIn ? (
          <li>
            <Link href="/track" className={styles.trackLink}>Track Appointment</Link>
            <Image src="/user-icon.png" alt="User Icon" width={28} height={28} className={styles.userIcon} />
          </li>
        ) : (
          <>
            <li className={styles.authBtns}>
              <Link href="/auth/signup">
                <span className={styles.signupBtn}>Sign Up</span>
              </Link>
              <Link href="/auth/login">
                <span className={styles.loginBtn}>Log In</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
