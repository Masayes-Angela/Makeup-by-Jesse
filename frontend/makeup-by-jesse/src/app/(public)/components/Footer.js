'use client';

import styles from '../styles/Footer.module.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

const socialUrls = {
  facebook: 'https://facebook.com/yourpage',
  instagram: 'https://instagram.com/yourpage',
  tiktok: 'https://tiktok.com/@yourpage',
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <h3 className={styles.footerLogo}>
          <span style={{ color: '#4ac7c5' }}>Makeup</span><em> by Jesse</em>
        </h3>
      </div>

      <div className={styles.footerLinks}>
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Cookies</Link>
      </div>

      <div className={styles.footerSocials}>
        <Link href={socialUrls.facebook} className={styles.socialCircle} target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </Link>
        <Link href={socialUrls.instagram} className={styles.socialCircle} target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </Link>
        <Link href={socialUrls.tiktok} className={styles.socialCircle} target="_blank" rel="noopener noreferrer">
          <FaTiktok />
        </Link>
      </div>
    </footer>
  );
}