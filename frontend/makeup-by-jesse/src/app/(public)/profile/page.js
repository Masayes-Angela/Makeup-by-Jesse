"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/Profile.module.css"
import { FiEdit2 } from "react-icons/fi"
import { BsCheckCircle } from "react-icons/bs"
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useDeactivateUserMutation,
} from "@/rtk/authApi"

export default function ManageProfilePage() {
  const router = useRouter()

  // State for user data
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [userId, setUserId] = useState(null)

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
  const [deleteMsg, setDeleteMsg] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordToast, setPasswordToast] = useState(false)
  const [profileImage, setProfileImage] = useState("/no-profile-pic.jpg")
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // RTK Query hooks
  const [updateUser] = useUpdateUserMutation()
  const [updateUserPassword] = useUpdateUserPasswordMutation()
  const [deactivateUser] = useDeactivateUserMutation()

  // Fix for hydration error - only run client-side code after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if user is logged in and redirect if not
  useEffect(() => {
    if (!isMounted) return

    const token = localStorage.getItem("userToken")
    const id = localStorage.getItem("userId")

    if (!token || !id) {
      router.push("/auth/login")
      return
    }

    setUserId(id)

    // Load saved image from localStorage
    const savedImage = localStorage.getItem("userProfileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [router, isMounted])

  // Fetch user data
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch,
  } = useGetUserByIdQuery(userId, { skip: !userId || !isMounted })

  // Set user data when fetched
  useEffect(() => {
    if (userData) {
      setName(userData.full_name || "")
      setEmail(userData.email || "")
      setPhone(userData.contact_number || "")

      setFormName(userData.full_name || "")
      setFormEmail(userData.email || "")
      setFormPhone(userData.contact_number || "")

      setIsLoading(false)
    }
  }, [userData])

  // Handle modal timeouts
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [showModal])

  useEffect(() => {
    if (passwordToast) {
      const timer = setTimeout(() => setPasswordToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [passwordToast])

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png"]
    const maxSize = 2 * 1024 * 1024 // 2MB

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

  // Handle saving user info
  const handleSaveInfo = async () => {
    setInfoError("")

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formEmail)) {
      setInfoError("Please enter a valid email address.")
      return
    }

    try {
      // Update user in database
      await updateUser({
        id: userId,
        full_name: formName,
        contact_number: formPhone,
        // Note: email is not updated here as it might require verification
        // If you want to update email, you'll need to add that to your backend
      }).unwrap()

      // Update local state
      setName(formName)
      setEmail(formEmail)
      setPhone(formPhone)
      setIsEditingInfo(false)
      setShowModal(true)

      // Update localStorage
      localStorage.setItem("userName", formName)

      // Refetch user data
      refetch()
    } catch (error) {
      console.error("Failed to update user:", error)
      setInfoError(error.data?.error || "Failed to update profile. Please try again.")
    }
  }

  const handleCancelInfo = () => {
    setFormName(name)
    setFormEmail(email)
    setFormPhone(phone)
    setIsEditingInfo(false)
    setInfoError("")
  }

  // Handle password change
  const handleSavePassword = async () => {
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.")
      return
    }

    if (newPassword.length < 8 || !/[0-9!@#$%^&*]/.test(newPassword)) {
      setPasswordError("Password must be at least 8 characters and include a number or symbol.")
      return
    }

    try {
      // Update password in database
      await updateUserPassword({
        id: userId,
        password: newPassword,
        // Note: Your backend should verify the current password
        // You might need to modify your backend to accept currentPassword
      }).unwrap()

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsEditingPassword(false)
      setPasswordToast(true)
    } catch (error) {
      console.error("Failed to update password:", error)
      setPasswordError(error.data?.error || "Failed to update password. Please try again.")
    }
  }

  const handleCancelPassword = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setIsEditingPassword(false)
  }

  // Handle account deletion
  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      // Deactivate user in database
      await deactivateUser(userId).unwrap()

      // Clear local storage
      localStorage.removeItem("userToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userProfileImage")

      setDeleteMsg("Account deletion requested.")
      setShowDeleteModal(false)

      // Redirect to goodbye page
      setTimeout(() => {
        router.push("/goodbye")
      }, 500)
    } catch (error) {
      console.error("Failed to delete account:", error)
      setDeleteMsg("Failed to delete account. Please try again.")
      setShowDeleteModal(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  // Return early if not mounted to prevent hydration errors
  if (!isMounted) {
    return null // Return nothing during SSR
  }

  // Show loading state
  if (isLoading || isUserLoading) {
    return (
      <section className={styles.profileWrapper}>
        <h2 className={styles.pageHeading}>Account Settings</h2>
        <div className={styles.loadingState}>
          <p>Loading your profile information...</p>
        </div>
      </section>
    )
  }

  // Show error state
  if (userError) {
    return (
      <section className={styles.profileWrapper}>
        <h2 className={styles.pageHeading}>Account Settings</h2>
        <div className={styles.errorState}>
          <p>Error loading profile. Please try again later.</p>
          <button onClick={() => router.push("/auth/login")} className={styles.loginBtn}>
            Return to Login
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.profileWrapper}>
      <h2 className={styles.pageHeading}>Account Settings</h2>
      <p className={styles.pageSubheading}>Manage your account settings and set email preferences.</p>

      <div className={styles.topCard}>
        <div className={styles.profileImageBox}>
          <div className={styles.imageContainer}>
            <img src={profileImage || "/placeholder.svg"} alt="Profile" className={styles.profileImage} />
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
            {showModal && !isEditingInfo && <span className={styles.toastMsg}>✔ Info updated!</span>}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Change Password</h3>
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
            {passwordToast && <span className={styles.toastMsg}>✔ Password changed!</span>}
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
              <button className={styles.confirm} onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className={styles.cancel} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
