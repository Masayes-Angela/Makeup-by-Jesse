'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Services.module.css';
import Image from 'next/image';
import Link from 'next/link';

// Mock service data (can be replaced with API later)
const servicesData = [
  {
    id: 1,
    image: '/services/5.jpg',
    title: 'Bridal Glam',
    slug: 'bridal-glam',
    description: 'Get the perfect bridal look with soft elegance and long-lasting glam.',
  },
  {
    id: 2,
    image: '/services/6.jpg',
    title: 'Debut Look',
    slug: 'debut-look',
    description: 'Celebrate your 18th with glowing, camera-ready beauty.',
  },
  {
    id: 3,
    image: '/services/5.jpg',
    title: 'Bridal Glam',
    slug: 'bridal-glam',
    description: 'Get the perfect bridal look with soft elegance and long-lasting glam.',
  },
];

// Reusable card component
function ServiceCard({ image, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={image || '/default.jpg'}
          alt={title || 'Service image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <Link className={styles.bookBtn} href="/appointments">Book Now</Link>
      </div>
    </div>
  );
}

export default function ServicesSection() {
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

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="services" className={styles.services} ref={sectionRef}>
      <div className={styles.servicesWrapper}>
        <p className={`${styles.subheading} ${styles.fadeInUp} ${isVisible ? styles.visible : ''}`}>What We Offer</p>
        <h2 className={`${styles.heading} ${styles.fadeInUp} ${isVisible ? styles.visible : ''}`}>Our Services</h2>
        <div className={`${styles.serviceCards} ${styles.fadeInUp} ${isVisible ? styles.visible : ''}`}>
          {servicesData.length > 0 ? (
            servicesData.map((item) => (
              <ServiceCard key={item.id} {...item} />
            ))
          ) : (
            <p className={styles.noServices}>No services available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}