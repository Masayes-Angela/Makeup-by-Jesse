'use client';

import styles from '../styles/Hero.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { RiBookFill } from 'react-icons/ri';

export default function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroLeft}>
        <div className={styles.logoWrapper}>
          <Image
            src="/herosection_logo.png"
            alt="Makeup by Jesse logo"
            width={400}
            height={120}
            className={styles.logoImage}
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h3>Hair & Makeup Artist (HMUA)</h3>
          <Link href="/book" className={styles.hero_bookBtn}>
            <RiBookFill className={styles.bookIcon} />
            Book Now
          </Link>
        </div>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.framedImage}>
          <img
            src="/hero-background.jpeg"
            alt="Makeup by Jesse"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
