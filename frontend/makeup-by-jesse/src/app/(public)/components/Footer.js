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
      <div className={styles.footerTop}>
        <h3 className={styles.footerLogo}>
          <span style={{ color: '#4ac7c5' }}>Makeup</span><em> by Jesse</em>
        </h3>
        <div className={styles.footerSocials}>
          <p className={styles.followText}>FOLLOW</p>
          <div className={styles.socialIcons}>
            <Link href={socialUrls.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </Link>
            <Link href={socialUrls.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </Link>
            <Link href={socialUrls.tiktok} target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© SITE BY D3M UNIT</p>
      </div>
    </footer>
  );
}
