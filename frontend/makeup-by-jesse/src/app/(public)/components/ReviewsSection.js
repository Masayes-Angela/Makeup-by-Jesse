'use client';

import styles from '../styles/Reviews.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { ImQuotesLeft } from 'react-icons/im';
import { useRef, useEffect, useState } from 'react';

const reviews = [
  {
    name: 'Angela Beatrice',
    message:
      'I really like the team for example, a relationship-focused performance expectation might be that the employee sustain collegial working relationships with her peers, subordinates and customers.',
    avatar: '/id/id1.jpg',
  },
  {
    name: 'Sofia Mercado',
    message:
      'I really like the team for example, a relationship-focused performance expectation might be that the employee sustain collegial working relationships with her peers, subordinates and customers.',
    avatar: '/id/id2.jpg',
  },
];

export default function ReviewsSection() {
  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.reviewsHeader}>
        <p className={styles.reviewsTag}>Customer Reviews</p>
        <h2 className={styles.reviewsTitle}>What Our Customer’s Say</h2>
      </div>

      <div className={styles.reviewGrid}>
        {reviews.map((review, i) => (
          <div
            key={i}
            ref={el => (cardRefs.current[i] = el)}
            className={`${styles.reviewCard} ${styles.reviewFadeUp} ${visibleCards[i] ? styles.visible : ''}`}
          >
            <ImQuotesLeft className={styles.quoteIcon} />
            <p className={styles.reviewText}>{review.message}</p>
            <div className={styles.reviewer}>
              <Image
                src={review.avatar}
                alt={review.name}
                width={40}
                height={40}
                className={styles.reviewerImg}
              />
              <p className={styles.reviewerName}>{review.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.seeMoreWrap}>
        <Link href="/reviews" className={styles.seeMoreBtn}>See More</Link>
      </div>
    </section>
  );
}