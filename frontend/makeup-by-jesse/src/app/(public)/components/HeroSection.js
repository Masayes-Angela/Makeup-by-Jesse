'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from '../styles/Hero.module.css';
import Image from 'next/image';
import { RiBookFill } from 'react-icons/ri';

export default function HeroSection() {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleBookNowClick = () => {
    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/appointments');
    } else {
      router.push('/appointments');
    }
  };

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
          <button onClick={handleBookNowClick} className={styles.hero_bookBtn}>
            <RiBookFill className={styles.bookIcon} />
            Book Now
          </button>
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