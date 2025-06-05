'use client';

import { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { RiSettings5Fill } from "react-icons/ri";
import { BiSolidEditAlt } from 'react-icons/bi';

export default function Settings() {
  // User profile state
  const [profile, setProfile] = useState({
    fullName: "Admin's Full Name",
    businessName: "Makeup Artist's Full Name",
    role: "Admin",
    contactNumber: "09123456789",
    email: "jesse@gmail.com",
    address: "143, San Agustin, Sto. Tomas City, Batangas",
  });

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotification: true,
    bookingConfirmation: true,
    bookingStatusChanged: false
  });

  // Temporary state for edits
  const [tempProfile, setTempProfile] = useState({...profile});

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({
      ...tempProfile,
      [name]: value
    });
  };

  // Handle notification toggle changes
  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting]
    });
    
    // In a real app, you would save this to your backend:
    console.log(`${setting} is now ${!notifications[setting]}`);
  };

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Check if any fields are empty
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    // Check password length
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    // Clear errors if validation passes
    setPasswordError('');

    // In a real app, you would send this to your backend:
    console.log("Password change requested:", {
      currentPassword,
      newPassword
    });

    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    alert("Password changed successfully!");
  };

  // Handle profile edit submission
  const handleEditSubmit = () => {
    // Update the main profile state with temporary values
    setProfile({...tempProfile});
    setIsEditMode(false);
    
    // In a real app, you would send this to your backend:
    console.log("Profile updated:", tempProfile);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // If we're saving, update the main profile with temp values
      handleEditSubmit();
    } else {
      // If entering edit mode, reset temp state to current profile
      setTempProfile({...profile});
      setIsEditMode(true);
    }
  };

  // Example of how you would fetch profile data in a real app
  useEffect(() => {
    // This would be an API call in a real application
    const fetchProfileData = async () => {
      try {
        // Simulating API response
        const data = {
          fullName: "Jesse Camille",
          businessName: "Makeup Artist's Full Name",
          role: "Admin",
          contactNumber: "09123456789",
          email: "jesse@gmail.com",
          address: "matipunsoi",
        };
        
        setProfile(data);
        setTempProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Get first letter of name for avatar
  const getInitial = () => {
    return profile.fullName ? profile.fullName.charAt(0) : 'A';
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles['settings-heading']}>
        <div className={styles.container}>
          <div className={styles['icon-container']}>
            <RiSettings5Fill />
          </div>
          <h1>Settings</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Profile Header */}
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span>{getInitial()}</span>
            </div>
            <div className={styles.profileInfo}>
              <h2>{profile.fullName || profile.businessName}</h2>
              <p>{profile.role}</p>
              <p>{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Personal Information</h3>

          {isEditMode ? (
            <div className={styles.headerActions}>
              <button 
                className={styles.saveButton}
                onClick={handleEditSubmit}
              >
                Save
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setTempProfile({ ...profile });
                  setIsEditMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className={styles.editButton}
              onClick={() => setIsEditMode(true)}
            >
              Edit <BiSolidEditAlt className={styles.editIcon} />
            </button>
          )}
        </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Full Name</label>
              {isEditMode ? (
                <input 
                  type="text" 
                  name="fullName" 
                  value={tempProfile.fullName} 
                  onChange={handleProfileChange}
                  className={styles.editInput}
                />
              ) : (
                <p>{profile.fullName}</p>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Contact Number</label>
              {isEditMode ? (
                <input 
                  type="text" 
                  name="contactNumber" 
                  value={tempProfile.contactNumber} 
                  onChange={handleProfileChange}
                  className={styles.editInput}
                />
              ) : (
                <p>{profile.contactNumber}</p>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>User Role</label>
              <p>{profile.role}</p>  {/* Generally role isn't editable by user */}
            </div>
            
            <div className={styles.infoItem}>
              <label>Email Address</label>
              {isEditMode ? (
                <input 
                  type="email" 
                  name="email" 
                  value={tempProfile.email} 
                  onChange={handleProfileChange}
                  className={styles.editInput}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Address</label>
              {isEditMode ? (
                <input 
                  type="text" 
                  name="address" 
                  value={tempProfile.address} 
                  onChange={handleProfileChange}
                  className={styles.editInput}
                />
              ) : (
                <p>{profile.address}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.twoColumnLayout}>
        {/* Change Password Section */}
        <div className={styles.sectionCard}>
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.passwordInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.passwordInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.passwordInput}
              />
              {passwordError && <p className={styles.errorText}>{passwordError}</p>}
            </div>
            
            <button type="submit" className={styles.passwordButton}>Change Password</button>
          </form>
        </div>

          {/* Notifications Section */}
          <div className={styles.sectionCard}>
            <h3>Notifications</h3>
            <div className={styles.notificationOptions}>
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h4>Email Notification</h4>
                  <p>Turn on email notification to get updates through email</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailNotification}
                    onChange={() => handleNotificationChange('emailNotification')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h4>Booking Confirmation</h4>
                  <p>You will be notified when client books an appointment</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={notifications.bookingConfirmation}
                    onChange={() => handleNotificationChange('bookingConfirmation')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h4>Booking Status Changed</h4>
                  <p>You will be notified when client make changes to the appointment</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={notifications.bookingStatusChanged}
                    onChange={() => handleNotificationChange('bookingStatusChanged')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}