'use client';

import { useState } from 'react';
import styles from '../styles/contact.module.css';
import { BiSolidEditAlt } from 'react-icons/bi';

export default function ContactSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
  });

  const [formData, setFormData] = useState(contactInfo);

  const handleEdit = () => {
    setFormData(contactInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedData = {
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
    };
    setContactInfo(trimmedData);
    setIsEditing(false);
  };

  const hasChanges = JSON.stringify(contactInfo) !== JSON.stringify(formData);

  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Contact Details</h2>
        {!isEditing && (
          <button className={styles.editButton} onClick={handleEdit}>
            <span className={styles.buttonText}>Edit</span>
            <span className={styles.iconWrapper}><BiSolidEditAlt /></span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className={styles.formWrapper}>
          <label htmlFor="phone" className={styles.label}>Contact Number:</label>
          <input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={styles.input}
            placeholder="e.g. 0917-123-4567"
            autoComplete="tel"
            required
          />

          <label htmlFor="email" className={styles.label}>Email Address:</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
            placeholder="e.g. example@email.com"
            autoComplete="email"
            required
          />

          <label htmlFor="address" className={styles.label}>Location/Address:</label>
          <textarea
            id="address"
            rows="3"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={styles.textarea}
            placeholder="Street, Barangay, City, Province"
            required
          />

          <div className={styles.buttonGroup}>
            <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.contactPreview}>
          <p><strong>Phone:</strong> {contactInfo.phone || 'Not set'}</p>
          <p><strong>Email:</strong> {contactInfo.email || 'Not set'}</p>
          <p><strong>Address:</strong> {contactInfo.address || 'Not set'}</p>
        </div>
      )}
    </div>
  );
}