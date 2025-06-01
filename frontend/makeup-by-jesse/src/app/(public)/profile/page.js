'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Profile.module.css';
import { FiEdit2 } from 'react-icons/fi';
import { BsCheckCircle } from 'react-icons/bs';

export default function ManageProfilePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [infoError, setInfoError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [imageError, setImageError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordToast, setPasswordToast] = useState(false);

  const [profileImage, setProfileImage] = useState('/no-profile-pic.jpg');

  useEffect(() => {
    const defaultName = 'Angeline Masayes';
    const defaultEmail = 'ange123@gmail.com';
    const defaultPhone = '09123456789';

    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);

    setFormName(defaultName);
    setFormEmail(defaultEmail);
    setFormPhone(defaultPhone);

    // ✅ Load saved image from localStorage
    const savedImage = localStorage.getItem('userProfileImage');
    setProfileImage(savedImage || '/no-profile-pic.jpg');
  }, []);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  useEffect(() => {
    if (passwordToast) {
      const timer = setTimeout(() => setPasswordToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [passwordToast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setImageError('Only JPEG and PNG files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setImageError('Image must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem('userProfileImage', reader.result);
      setImageError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage('/no-profile-pic.jpg');
    localStorage.removeItem('userProfileImage');
  };

  const handleSaveInfo = () => {
    setInfoError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setInfoError('Please enter a valid email address.');
      return;
    }

    setName(formName);
    setEmail(formEmail);
    setPhone(formPhone);
    setIsEditingInfo(false);
    setShowModal(true);
  };

  const handleCancelInfo = () => {
    setFormName(name);
    setFormEmail(email);
    setFormPhone(phone);
    setIsEditingInfo(false);
    setInfoError('');
  };

  const handleSavePassword = () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8 || !/[0-9!@#$%^&*]/.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters and include a number or symbol.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
    setPasswordToast(true);
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEditingPassword(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setDeleteMsg('Account deletion requested.');
    setShowDeleteModal(false);
    setTimeout(() => {
      router.push('/goodbye');
    }, 500);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <section className={styles.profileWrapper}>
      <h2 className={styles.pageHeading}>Account Settings</h2>
      <p className={styles.pageSubheading}>
        Manage your account settings and set email preferences.
      </p>

      <div className={styles.topCard}>
<div className={styles.profileImageBox}>
  <div className={styles.imageContainer}>
    <img src={profileImage} alt="Profile" className={styles.profileImage} />
    <div className={styles.overlay}>
      <label htmlFor="profileUpload" className={styles.overlayBtn}>Change</label>
      {profileImage !== '/no-profile-pic.jpg' && (
        <button className={styles.overlayBtn} onClick={handleRemoveImage}>Remove</button>
      )}
    </div>
    <input
      type="file"
      accept="image/png, image/jpeg"
      onChange={handleImageChange}
      className={styles.fileInput}
      id="profileUpload"
    />
  </div>
  {imageError && <p className={styles.errorMsg}>{imageError}</p>}
</div>


        <div className={styles.userInfo}>
          <h3>{name}</h3>
          <p>{email}</p>
        </div>
      </div>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Personal Information</h3>
            {isEditingInfo ? (
              <div className={styles.actionBtns}>
                <button className={styles.saveBtn} onClick={handleSaveInfo}>Save Changes</button>
                <button className={styles.cancelBtn} onClick={handleCancelInfo}>Cancel</button>
              </div>
            ) : (
              <button className={styles.editBtn} onClick={() => setIsEditingInfo(true)}>
                Edit <FiEdit2 />
              </button>
            )}
          </div>
          <div className={styles.cardContent}>
            {infoError && isEditingInfo && <p className={styles.errorMsg}>{infoError}</p>}
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className={styles.inputField}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={!isEditingInfo}
              autoComplete="name"
            />

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              disabled={!isEditingInfo}
              autoComplete="email"
            />

            <label htmlFor="contact">Contact Number</label>
            <input
              id="contact"
              type="tel"
              className={styles.inputField}
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              disabled={!isEditingInfo}
              autoComplete="tel"
            />
            {showModal && !isEditingInfo && (
              <span className={styles.toastMsg}>✔ Info updated!</span>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Change Password</h3>
            {isEditingPassword ? (
              <div className={styles.actionBtns}>
                <button className={styles.confirmBtn} onClick={handleSavePassword}>Confirm</button>
                <button className={styles.cancelBtn} onClick={handleCancelPassword}>Cancel</button>
              </div>
            ) : (
              <button className={styles.editBtn} onClick={() => setIsEditingPassword(true)}>
                Edit <FiEdit2 />
              </button>
            )}
          </div>
          <div className={styles.cardContent}>
            {passwordError && isEditingPassword && <p className={styles.errorMsg}>{passwordError}</p>}
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              className={styles.inputField}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!isEditingPassword}
              autoComplete="current-password"
            />

            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              className={styles.inputField}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isEditingPassword}
              autoComplete="new-password"
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditingPassword}
              autoComplete="new-password"
            />
            {passwordToast && (
              <span className={styles.toastMsg}>✔ Password changed!</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.deleteBox}>
        <h4>Delete Account</h4>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          🗑 Delete Account
        </button>
        {deleteMsg && <p className={styles.warningMsg}>{deleteMsg}</p>}
      </div>

      {showModal && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <div className={styles.iconWrapper}>
              <BsCheckCircle className={styles.checkIcon} />
            </div>
            <h3>Success</h3>
            <p>Your information has been updated successfully.</p>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <h3>Confirm Deletion</h3>
            <p>This action is irreversible. Do you want to proceed?</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirm} onClick={confirmDelete}>Yes, Delete</button>
              <button className={styles.cancel} onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}