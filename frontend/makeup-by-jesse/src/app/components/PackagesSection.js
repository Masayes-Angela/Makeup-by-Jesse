'use client';

import styles from '../styles/page.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const packagesData = [
  {
    title: 'Classic Wedding Package',
    price: '₱10,900',
    description: [
      'Bridal Hair & HD Traditional Makeup (with 3D lashes)',
      'Unlimited retouches until the reception',
      'Pre-wedding, Ceremony & Reception looks',
      'Groom’s basic makeup & hairstyling',
      '2 complimentary hair & makeup sessions for guests (with lashes)',
      '🎁 Bonus: Free post-makeup bridal portrait photos',
    ],
    inclusions: [
      '✔ Skin prep for a flawless base',
      '✔ 3D lashes for enhanced eyes',
      '✔ Non-graded contact lenses',
      '✔ Free use of hair extensions',
      '✔ Free use of bridal hair accessories',
    ],
    additional: [
      '💠 Hair & Makeup (ladies): ₱2,000/head (₱1,800 for 5+ heads)',
      '💠 Flower Girls: ₱1,000',
      '💠 Groomsmen: ₱1,000',
    ],
    images: ['/services/2.jpg', '/services/3.jpg'],
  },
];

export default function PackagesSection() {
  const [currentIndex, setIndex] = useState(0);

  return (
    <section id="packages" className={styles.packages}>
      <h2>Bridal Makeup Packages</h2>
      {packagesData.map((pkg, i) => (
        <div className={styles.packageContent} key={i}>
          <div className={styles.packageImages}>
            {pkg.images.length > 1 ? (
              <>
                <button
                  className={`${styles.packageNavBtn} ${styles.left}`}
                  onClick={() => setIndex((currentIndex - 1 + pkg.images.length) % pkg.images.length)}
                >
                  <FiChevronLeft />
                </button>
                <Image
                  src={pkg.images[currentIndex]}
                  width={280}
                  height={350}
                  alt="Package preview"
                />
                <button
                  className={`${styles.packageNavBtn} ${styles.right}`}
                  onClick={() => setIndex((currentIndex + 1) % pkg.images.length)}
                >
                  <FiChevronRight />
                </button>
              </>
            ) : (
              <Image
                src={pkg.images[0]}
                width={280}
                height={350}
                alt="Package preview"
              />
            )}
          </div>
          <div className={styles.packageDetails}>
            <h3>{pkg.title}</h3>
            <h4>{pkg.price}</h4>
            <ul>{pkg.description.map((line, j) => <li key={j}>{line}</li>)}</ul>
            <h4>✨ Inclusions for the Bride:</h4>
            <ul>{pkg.inclusions.map((line, j) => <li key={j}>{line}</li>)}</ul>
            <h4>👰 Additional Services:</h4>
            <ul>{pkg.additional.map((line, j) => <li key={j}>{line}</li>)}</ul>
            <p>📍 Transportation & out-of-town fees apply.</p>
            <p className={styles.bookNote}>💖 Book your bridal glam today! 💖</p>
          </div>
        </div>
      ))}
    </section>
  );
}