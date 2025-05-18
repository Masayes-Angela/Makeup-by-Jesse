'use client';

import styles from '../styles/page.module.css';
import Image from 'next/image';

const galleryData = ['/g1.jpg', '/g2.jpg', '/g3.jpg'];

export default function GallerySection() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.galleryIntro}>
        <h3>Jesse’s Gallery</h3>
        <p>A showcase of beauty, confidence, and creativity—powered by you.</p>
      </div>
      <div className={styles.galleryPhotos}>
        {galleryData.map((src, i) => (
          <Image
            key={i}
            src={src}
            width={200}
            height={250}
            alt={`gallery-${i}`}
            className={styles.galleryImg}
          />
        ))}
      </div>
    </section>
  );
}