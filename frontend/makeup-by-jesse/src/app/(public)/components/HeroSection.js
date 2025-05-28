'use client';

import styles from '../styles/Hero.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContent}>
        <Image src="/logo.png" width={360} height={240} alt="Makeup by Jesse logo" />
        <h3>Hair & Makeup Artist (HMUA)</h3>
        <Link href="/book" className={styles.hero_bookBtn}>Book Now</Link>
      </div>
      <div className={styles.heroShape}></div>
    </section>
  );
}
