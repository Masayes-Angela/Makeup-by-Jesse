'use client';
import styles from '../styles/Gallery.module.css';
import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

const images = [
  '/gallery/img1.jpg',
  '/gallery/img2.jpg',
  '/gallery/img3.jpg',
  '/gallery/img4.jpg',
  '/gallery/img5.jpg',
];

export default function GallerySection() {
  const [startIndex, setStartIndex] = useState(0);
  const [linesVisible, setLinesVisible] = useState(false);
  const linesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLinesVisible(true);
      },
      { threshold: 0.2 }
    );

    if (linesRef.current) observer.observe(linesRef.current);

    return () => observer.disconnect();
  }, []);

  const slideLeft = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const slideRight = () => {
    if (startIndex < images.length - 3) setStartIndex(startIndex + 1);
  };

  return (
    <section id='gallery' className={styles.gallerySection}>
      <div
        ref={linesRef}
        className={`${styles.galleryLines} ${styles.lineFadeDown} ${linesVisible ? styles.visible : ''}`}
      >
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.galleryContent}>
        <div className={styles.galleryText}>
          <h2>Jesse’s Gallery</h2>
          <p>A showcase of beauty, confidence, and creativity—powered by you.</p>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={`${styles.navBtn} ${styles.leftBtn}`}
            onClick={slideLeft}
            disabled={startIndex === 0}
          >
            <FaChevronLeft />
          </button>

          <div className={styles.carouselWindow}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${startIndex * (240 + 30)}px)` }}
            >
              {images.map((src, i) => (
                <div className={styles.imageCard} key={i}>
                  <Image
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'top',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.navBtn} ${styles.rightBtn}`}
            onClick={slideRight}
            disabled={startIndex >= images.length - 3}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}