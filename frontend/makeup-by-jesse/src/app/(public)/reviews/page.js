'use client';

import styles from './reviews.module.css';
import Image from 'next/image';
import { ImQuotesLeft } from 'react-icons/im';
import { useEffect, useState } from 'react';

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/reviews/published');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Client Reviews</h1>
        <p className={styles.heroSubtitle}>
          Hear from the beautiful faces we've glammed up.
        </p>
      </section>

      {/* Main Content with Wrapper */}
      <div className={styles.reviewWrapper}>
        <section className={styles.reviewsSection}>
          <div className={styles.reviewGrid}>
            {reviews.length === 0 ? (
              <p className={styles.emptyMsg}>No reviews available yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <ImQuotesLeft className={styles.quoteIcon} />
                  <p className={styles.reviewText}>{review.message}</p>
                  <div className={styles.reviewer}>
                    <Image
                      src={review.avatar_url || '/no-profile-pic.jpg'}
                      alt={review.name}
                      width={40}
                      height={40}
                      className={styles.reviewerImg}
                    />
                    <p className={styles.reviewerName}>{review.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}