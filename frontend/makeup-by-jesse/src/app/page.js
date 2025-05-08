'use client';

import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const servicesData = [
  { image: '/services/1.jpg', title: 'Bridal Glam' },
  { image: '/services/4.jpg', title: 'Debut Look' },
];

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
    images: ['/services/2.jpg', '/services/3.jpg'], // Add more to test slider
  },
];

const aboutData = {
  image: '/about.jpg',
  description: 'Hi! I’m Jesse, a professional HMUA offering glam transformations for special moments...',
};

const galleryData = [
  '/g1.jpg',
  '/g2.jpg',
  '/g3.jpg',
];

export default function Home() {
  const [currentPackageImgIndex, setIndex] = useState(0);

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.pageContent}>

        {/* Hero */}
        <section id="hero" className={styles.hero}>
          <div className={styles.heroContent}>
            <Image src="/logo.png" width={360} height={240} alt="Makeup by Jesse logo" />
            <h3>Hair & Makeup Artist (HMUA)</h3>
            <Link href="/book" className={styles.hero_bookBtn}>Book Now</Link>
          </div>
          <div className={styles.heroShape}></div>
        </section>

        {/* Services */}
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

        {/* Packages */}
        <section id="packages" className={styles.packages}>
          <h2>Bridal Makeup Packages</h2>
          {packagesData.map((pkg, i) => (
            <div className={styles.packageContent} key={i}>
              <div className={styles.packageImages}>
                {pkg.images.length > 1 ? (
                  <>
                    <button
                      className={`${styles.packageNavBtn} ${styles.left}`}
                      onClick={() => setIndex((currentPackageImgIndex - 1 + pkg.images.length) % pkg.images.length)}
                    >
                      <FiChevronLeft />
                    </button>
                    <Image
                      src={pkg.images[currentPackageImgIndex]}
                      width={280}
                      height={350}
                      alt="Package preview"
                    />
                    <button
                      className={`${styles.packageNavBtn} ${styles.right}`}
                      onClick={() => setIndex((currentPackageImgIndex + 1) % pkg.images.length)}
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

        {/* About Me */}
        <section id="about" className={styles.about}>
          <div className={styles.aboutImage}>
            <img src={aboutData.image} alt="About Jesse" />
          </div>
          <div className={styles.aboutText}>
            <h2>About Me</h2>
            <p>{aboutData.description}</p>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className={styles.gallery}>
          <div className={styles.galleryIntro}>
            <h3>Jesse’s Gallery</h3>
            <p>A showcase of beauty, confidence, and creativity—powered by you.</p>
          </div>
          <div className={styles.galleryPhotos}>
            {galleryData.map((src, i) => (
              <Image key={i} src={src} width={200} height={250} alt={`gallery-${i}`} className={styles.galleryImg} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}