"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import styles from "../styles/Profile.module.css"
import { FiEdit2 } from "react-icons/fi"
import { BsCheckCircle } from "react-icons/bs"
import {
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useDeactivateUserMutation,
} from "@/rtk/authApi"
import { clearCredentials } from "@/rtk/authSlice"

export default function ManageProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)

  // Form state
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI state
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [infoError, setInfoError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [imageError, setImageError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordToast, setPasswordToast] = useState(false)
  const [profileImage, setProfileImage] = useState("/no-profile-pic.jpg")

  const [updateUser] = useUpdateUserMutation()
  const [updateUserPassword] = useUpdateUserPasswordMutation()
  const [deactivateUser] = useDeactivateUserMutation()

  // Redirect to login if no auth
  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
    }
  }, [user, token, router])

  // Initialize form fields
  useEffect(() => {
    if (user) {
      setFormName(user.full_name || "")
      setFormEmail(user.email || "")
      setFormPhone(user.contact_number || "")
    }
  }, [user])

  // Profile image management
  useEffect(() => {
    const savedImage = localStorage.getItem("userProfileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png"]
    const maxSize = 2 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      setImageError("Only JPEG and PNG files are allowed.")
      return
    }

    if (file.size > maxSize) {
      setImageError("Image must be less than 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result)
      localStorage.setItem("userProfileImage", reader.result)
      setImageError("")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setProfileImage("/no-profile-pic.jpg")
    localStorage.removeItem("userProfileImage")
  }

  const handleSaveInfo = async () => {
    setInfoError("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formEmail)) {
      setInfoError("Please enter a valid email address.")
      return
    }

    try {
      await updateUser({
        id: user.id,
        full_name: formName,
        contact_number: formPhone,
      }).unwrap()

      setIsEditingInfo(false)
      setShowModal(true)
    } catch (error) {
      setInfoError(error.data?.error || "Failed to update profile. Please try again.")
    }
  }

  const handleSavePassword = async () => {
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }

    if (newPassword.length < 8 || !/[0-9!@#$%^&*]/.test(newPassword)) {
      setPasswordError("Password must be at least 8 characters and include a number or symbol.")
      return
    }

    try {
      await updateUserPassword({
        id: user.id,
        password: newPassword,
      }).unwrap()

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsEditingPassword(false)
      setPasswordToast(true)
    } catch (error) {
      setPasswordError(error.data?.error || "Failed to update password.")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deactivateUser(user.id).unwrap()
      dispatch(clearCredentials())
      localStorage.removeItem("userProfileImage")
      router.push("/goodbye")
    } catch (error) {
      console.error("Failed to delete account:", error)
    }
  }

  const handleCancelInfo = () => {
    setFormName(user.full_name)
    setFormEmail(user.email)
    setFormPhone(user.contact_number)
    setIsEditingInfo(false)
    setInfoError("")
  }

  const handleCancelPassword = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setIsEditingPassword(false)
  }

  return (
    <section className={styles.profileWrapper}>
      <h2 className={styles.pageHeading}>Account Settings</h2>
      <div className={styles.topCard}>
        <div className={styles.profileImageBox}>
          <div className={styles.imageContainer}>
            <img src={profileImage} alt="Profile" className={styles.profileImage} />
            <div className={styles.overlay}>
              <label htmlFor="profileUpload" className={styles.overlayBtn}>
                Change
              </label>
              {profileImage !== "/no-profile-pic.jpg" && (
                <button className={styles.overlayBtn} onClick={handleRemoveImage}>
                  Remove
                </button>
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
        {user && (
          <div className={styles.userInfo}>
            <h3>{user.full_name}</h3>
            <p>{user.email}</p>
          </div>
        )}
      </div>

      <div className={styles.cardWrapper}>
        {/* Personal Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Personal Information</h3>
            {isEditingInfo ? (
              <div className={styles.actionBtns}>
                <button className={styles.saveBtn} onClick={handleSaveInfo}>
                  Save Changes
                </button>
                <button className={styles.cancelBtn} onClick={handleCancelInfo}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className={styles.editBtn} onClick={() => setIsEditingInfo(true)}>
                Edit <FiEdit2 />
              </button>
            )}
          </div>
          <div className={styles.cardContent}>
            {infoError && <p className={styles.errorMsg}>{infoError}</p>}
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              className={styles.inputField}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={!isEditingInfo}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={styles.inputField}
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              disabled
            />
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className={styles.inputField}
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              disabled={!isEditingInfo}
            />
            {showModal && <span className={styles.toastMsg}>✔ Info updated!</span>}
          </div>
        </div>

        {/* Password Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Change Password</h3>
            {isEditingPassword ? (
              <div className={styles.actionBtns}>
                <button className={styles.confirmBtn} onClick={handleSavePassword}>
                  Confirm
                </button>
                <button className={styles.cancelBtn} onClick={handleCancelPassword}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className={styles.editBtn} onClick={() => setIsEditingPassword(true)}>
                Edit <FiEdit2 />
              </button>
            )}
          </div>
          <div className={styles.cardContent}>
            {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className={styles.inputField}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!isEditingPassword}
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className={styles.inputField}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isEditingPassword}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditingPassword}
            />
            {passwordToast && <span className={styles.toastMsg}>✔ Password changed!</span>}
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className={styles.deleteBox}>
        <h4>Delete Account</h4>
        <p>Once deleted, your data cannot be recovered.</p>
        <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
          🗑 Delete Account
        </button>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <h3>Confirm Deletion</h3>
            <p>This action cannot be undone. Proceed?</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirm} onClick={handleDeleteAccount}>
                Yes, Delete
              </button>
              <button className={styles.cancel} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}