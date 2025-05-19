'use client';

import styles from '../styles/footer.module.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <h3 className={styles.footerLogo}><span style={{ color: '#4ac7c5' }}>Makeup</span><em> by Jesse</em></h3>
      </div>

      <div className={styles.footerLinks}>
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Cookies</Link>
      </div>

      <div className={styles.footerSocials}>
        <Link href="#" className={styles.socialCircle}><FaFacebookF /></Link>
        <Link href="#" className={styles.socialCircle}><FaInstagram /></Link>
        <Link href="#" className={styles.socialCircle}><FaTiktok /></Link>
      </div>
    </footer>
  );
}