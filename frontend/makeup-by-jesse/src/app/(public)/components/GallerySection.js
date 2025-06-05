'use client';
import styles from '../styles/Gallery.module.css';
import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

const images = [
  { id: 1, src: '/gallery/img1.jpg' },
  { id: 2, src: '/gallery/img4.jpg' },
  { id: 3, src: '/gallery/img11.jpg' },
  { id: 4, src: '/gallery/img8.jpg' },
  { id: 5, src: '/gallery/img10.jpg' },
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
              {images.map(({ id, src }, index) => (
                <div className={styles.imageCard} key={id}>
                  <Image
                    src={src || '/default.jpg'}
                    alt={`Gallery ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 240px"
                    loading="lazy"
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