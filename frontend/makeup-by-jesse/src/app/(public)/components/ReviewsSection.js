'use client';

import styles from '../styles/Reviews.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { ImQuotesLeft } from 'react-icons/im';
import { useRef, useEffect, useState } from 'react';
import { LuPencil } from 'react-icons/lu';
import { createPortal } from 'react-dom';
import { BsCheckCircle } from 'react-icons/bs';

export default function ReviewsSection() {
  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/reviews/published');
        const data = await res.json();
        console.log('Published reviews:', data);
        setReviews(data);
        setVisibleCards(new Array(data.length).fill(false)); // initialize animation state
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => {
              const updated = [...prev];
              const targetIndex = cardRefs.current.findIndex(el => el === entry.target);
              if (targetIndex !== -1) updated[targetIndex] = true;
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
  }, [reviews]);

  const handleNextStep = () => {
    if (reviewText.length > 500) {
      alert('Review too long. Please limit to 500 characters.');
      return;
    }
    setStep(2);
  };

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.reviewsHeader}>
        <p className={styles.reviewsTag}>Customer Reviews</p>
        <h2 className={styles.reviewsTitle}>What Our Customer’s Say</h2>
      </div>

      <div className={styles.reviewGrid}>
        {reviews.length === 0 ? (
          <p className={styles.emptyMsg}>No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.slice(0, 2).map((review, i) => (
            <div
              key={review.id}
              ref={el => (cardRefs.current[i] = el)}
              className={`${styles.reviewCard} ${styles.reviewFadeUp} ${visibleCards[i] ? styles.visible : ''}`}
            >
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

      <div className={styles.seeMoreWrap}>
        <Link href="/reviews" className={styles.seeMoreBtn}>See More</Link>
      </div>

      {isLoggedIn && (
        <div className={styles.writeReviewBox}>
          <button
            className={styles.writeReviewBtn}
            onClick={() => setShowModal(true)}
          >
            <LuPencil className={styles.writeIcon} />
            Write a Review
          </button>
        </div>
      )}

      {showModal && createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{step === 1 ? 'Write a Review' : 'Review Summary'}</h3>
            {step === 1 && (
              <p className={styles.subheading}>
                Thank you for letting me be part of your special moment. I’d love to hear how you felt!
              </p>
            )}
            {step === 1 ? (
              <>
                <textarea
                  rows="5"
                  maxLength={500}
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className={styles.modalTextarea}
                />
                <div className={styles.charCount}>{reviewText.length} / 500</div>
                <div className={styles.modalActions}>
                  <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                  <button onClick={handleNextStep} className={styles.nextBtn} disabled={!reviewText.trim()}>
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.previewText}>{reviewText}</p>
                <div className={styles.modalActions}>
                  <button onClick={() => setStep(1)} className={styles.cancelBtn}>Back</button>
                  <button
                    className={styles.submitBtn}
                    onClick={async () => {
                      setIsSubmitting(true);

                      try {
                        const res = await fetch('http://localhost:8080/api/reviews', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            name: 'Anonymous',
                            avatar_url: '/no-profile-pic.jpg',
                            message: reviewText
                          })
                        });

                        if (!res.ok) {
                          throw new Error('Failed to submit review');
                        }

                        setShowModal(false);
                        setShowSuccess(true);
                        setReviewText('');
                        setStep(1);
                      } catch (err) {
                        alert('Something went wrong: ' + err.message);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {showSuccess && createPortal(
        <div className={styles.successOverlay}>
          <div className={styles.successBox}>
            <button className={styles.closeBtn} onClick={() => setShowSuccess(false)}>✕</button>
            <div className={styles.iconWrapper}>
              <BsCheckCircle className={styles.checkIcon} />
            </div>
            <h3>Review Submitted</h3>
            <p>Thanks for sharing your experience!</p>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}