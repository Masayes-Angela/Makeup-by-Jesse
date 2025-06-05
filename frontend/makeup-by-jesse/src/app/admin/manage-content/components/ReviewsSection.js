'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/reviews.module.css';
import { GoSortAsc } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";

const mockReviews = [
  {
    id: 1,
    name: 'Angeline Ladylyn D. Masayes',
    email: 'teamBa.programmers@gmail.com',
    review: 'I really like the team for example, a relationship-focused performance expectation might be that the employee sustain collegial working relationships with her peers, subordinates and customers.',
    status: 'Published',
    submittedAt: '2024-06-01T12:00:00Z'
  },
  {
    id: 2,
    name: 'Jennie Ruby Jane Kim',
    email: 'blackpink.in.your.area@gmail.com',
    review: 'I really like the team for example, a relationship-focused performance expectation might be that the employee sustain collegial working relationships with her peers, subordinates and customers.',
    status: 'Pending',
    submittedAt: '2024-06-04T09:00:00Z'
  },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [sortOrder, setSortOrder] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSortOrder(value);
    setOpen(false);

    const sorted = [...reviews].sort((a, b) => {
      return value.toLowerCase() === 'newest'
        ? new Date(b.submittedAt) - new Date(a.submittedAt)
        : new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    setReviews(sorted);
  };

  const openModal = (review) => setSelectedReview(review);
  const closeModal = () => setSelectedReview(null);

  const confirmPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const updated = reviews.map(r =>
        r.id === selectedReview.id ? { ...r, status: 'Published' } : r
      );
      setReviews(updated);
      setIsPublishing(false);
      closeModal();
    }, 1000);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          Reviews <span className={styles.reviewCount}>({reviews.length})</span>
        </h2>

        <div className={styles.customSortDropdown} ref={dropdownRef}>
          <button onClick={() => setOpen(!open)} className={styles.sortButton}>
            <GoSortAsc className={styles.iconLeft} />
            <span>{sortOrder ? `${sortOrder}` : 'Sort'}</span>
            <RiArrowDropDownLine className={styles.iconRight} />
          </button>
          {open && (
            <div className={styles.dropdownList}>
              <div onClick={() => handleSelect('Newest')}>Newest</div>
              <div onClick={() => handleSelect('Oldest')}>Oldest</div>
            </div>
          )}
        </div>
      </div>

      <table className={styles.reviewTable}>
        <thead>
          <tr>
            <th>Received By</th>
            <th>Email</th>
            <th>Review</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => {
            const isExpanded = expandedId === r.id;
            const isPublished = r.status.toLowerCase() === 'published';
            const reviewText = isExpanded
              ? r.review
              : r.review.slice(0, 120) + (r.review.length > 120 ? '...' : '');

            return (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>
                  <div className={styles.reviewContent}>
                    {reviewText}
                    {r.review.length > 120 && (
                      <button className={styles.readMoreBtn} onClick={() => toggleExpand(r.id)}>
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  {isPublished ? (
                    <span className={styles.published}>Published</span>
                  ) : (
                    <button
                      onClick={() => openModal(r)}
                      className={styles.publishBtn}
                      disabled={isPublishing}
                    >
                      {isPublishing && selectedReview?.id === r.id ? 'Publishing...' : 'Publish'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedReview && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className={styles.modal}>
            <h3 id="modalTitle">Publish Review</h3>
            <p>Are you sure you want to publish this review?</p>
            <div className={styles.modalActions}>
              <button onClick={confirmPublish} className={styles.confirmBtn} disabled={isPublishing}>
                {isPublishing ? 'Publishing...' : 'Yes, Publish'}
              </button>
              <button onClick={closeModal} className={styles.cancelBtn} disabled={isPublishing}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}