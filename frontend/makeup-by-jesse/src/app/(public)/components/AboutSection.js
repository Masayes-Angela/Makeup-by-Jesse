'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/About.module.css';

const aboutData = {
  image: '/about/jesse.jpeg',
  subtitle: 'Professional Hair and Makeup Artist',
  description:
    'Hi! I’m Jesse, a professional HMUA offering glam transformations for special moments. I’m passionate about helping women feel their most confident and radiant during life’s most unforgettable occasions.',
  experience: '10',
};

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.aboutSection} ref={sectionRef}>
      <div className={`${styles.imageWrapper} ${styles.zoomIn} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.imageBorderWrapper}>
          <Image
            src={aboutData.image}
            alt="Jesse"
            width={200}
            height={320}
            className={styles.profileImage}
          />
        </div>
        <div className={`${styles.experienceBadge} ${styles.slideLeft} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.expContent}>
            <span className={styles.expNumber}>10+</span>
            <p className={styles.expLabel}>Years<br />Experience</p>
          </div>
        </div>
      </div>

      <div className={`${styles.aboutContent} ${styles.slideRight} ${isVisible ? styles.visible : ''}`}>
        <p className={styles.subheading}>About Me</p>
        <h2 className={styles.heading}>My Name is <span>Jesse</span></h2>
        <p className={styles.subtitle}>{aboutData.subtitle}</p>
        <p className={styles.description}>{aboutData.description}</p>
      </div>
    </section>
  );
}
