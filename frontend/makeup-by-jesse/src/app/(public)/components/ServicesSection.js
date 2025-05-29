'use client';

import styles from '../styles/Services.module.css';
import Image from 'next/image';
import Link from 'next/link';

const servicesData = [
  {
    image: '/services/5.jpg',
    title: 'Bridal Glam',
    description: 'Get the perfect bridal look with soft elegance and long-lasting glam.',
  },
  {
    image: '/services/6.jpg',
    title: 'Debut Look',
    description: 'Celebrate your 18th with glowing, camera-ready beauty.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <p className={styles.subheading}>What We Offer</p>
      <h2 className={styles.heading}>Our Services</h2>
      <div className={styles.serviceCards}>
        {servicesData.map((item, i) => (
          <div className={styles.card} key={i}>
            <Image
              src={item.image}
              alt={item.title}
              width={0}
              height={0}
              sizes="100vw"
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              <Link className={styles.services_bookBtn} href="/book">Book Now</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}