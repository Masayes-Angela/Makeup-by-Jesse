'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/reviews.module.css';
import { GoSortAsc } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch real reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleSelect = (value) => {
    setSortOrder(value);
    setOpen(false);

    const sorted = [...reviews].sort((a, b) => {
      return value.toLowerCase() === 'newest'
        ? new Date(b.submitted_at) - new Date(a.submitted_at)
        : new Date(a.submitted_at) - new Date(b.submitted_at);
    });

    setReviews(sorted);
  };

  const openModal = (review) => setSelectedReview(review);
  const closeModal = () => setSelectedReview(null);

  const confirmPublish = async () => {
    if (!selectedReview) return;

    setIsPublishing(true);

    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${selectedReview.id}/publish`, {
        method: 'PATCH'
      });

      if (!res.ok) throw new Error('Failed to publish');

      const updated = reviews.map(r =>
        r.id === selectedReview.id ? { ...r, status: 'PUBLISHED' } : r
      );

      setReviews(updated);
      closeModal();
    } catch (err) {
      console.error('Publish error:', err);
      alert('Failed to publish review.');
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Close dropdown if clicked outside
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
            <th>Review</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => {
            const isExpanded = expandedId === r.id;
            const isPublished = r.status === 'PUBLISHED';
            const reviewText = isExpanded
              ? r.message
              : r.message.slice(0, 120) + (r.message.length > 120 ? '...' : '');

            return (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <div className={styles.reviewContent}>
                    {reviewText}
                    {r.message.length > 120 && (
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