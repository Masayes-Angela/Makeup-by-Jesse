'use client';

import Image from 'next/image';
import styles from '../styles/page.module.css';

const aboutData = {
  image: '/about/jesse.jpeg',
  subtitle: 'Professional Hair and Makeup Artist',
  description:
    'Hi! I’m Jesse, a professional HMUA offering glam transformations for special moments. I’m passionate about helping women feel their most confident and radiant during life’s most unforgettable occasions.',
  experience: '10',
};

export default function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.imageWrapper}>
        <Image
          src={aboutData.image}
          alt="Jesse"
          width={200}
          height={320}
          className={styles.profileImage}
        />
        <div className={styles.experienceBadge}>
          <div className={styles.expContent}>
            <span className={styles.expNumber}>10+</span>
            <p className={styles.expLabel}>Years<br />Experience</p>
          </div>
        </div>
      </div>

      <div className={styles.aboutContent}>
        <p className={styles.tag}>About Me</p>
        <h2 className={styles.mainHeading}>My Name is <span>Jesse</span></h2>
        <p className={styles.subtitle}>{aboutData.subtitle}</p>
        <p className={styles.description}>{aboutData.description}</p>
      </div>
    </section>
  );
}