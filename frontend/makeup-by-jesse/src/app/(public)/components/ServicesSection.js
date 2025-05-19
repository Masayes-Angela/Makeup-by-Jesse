'use client';

import styles from '../styles/page.module.css';
import Image from 'next/image';
import Link from 'next/link';

const servicesData = [
  { image: '/services/1.jpg', title: 'Bridal Glam' },
  { image: '/services/4.jpg', title: 'Debut Look' },
];

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <h2>Services</h2>
      <div className={styles.serviceCards}>
        {servicesData.map((item, i) => (
          <div className={styles.card} key={i}>
            <Image src={item.image} alt={item.title} width={180} height={180} />
            <p>{item.title}</p>
            <Link className={styles.services_bookBtn} href="/book">Book Now</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
