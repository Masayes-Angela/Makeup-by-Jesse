"use client"

import { useState, useEffect } from "react"
import { useGetContactInfoQuery, useAddContactInfoMutation, useUpdateContactInfoMutation } from "@/rtk/contactApi"
import styles from "./contacts.module.css"

export default function AddContacts({ isEditing = false }) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: contactInfo, isLoading, refetch } = useGetContactInfoQuery()
  const [addContactInfo, { isLoading: isAdding }] = useAddContactInfoMutation()
  const [updateContactInfo, { isLoading: isSubmitting }] = useUpdateContactInfoMutation()

  useEffect(() => {
    if (contactInfo) {
      setPhone(contactInfo.phone || "")
      setEmail(contactInfo.email || "")
      setLocation(contactInfo.location || "")
    }
  }, [contactInfo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!phone || !email || !location) {
      setError("All fields are required")
      return
    }

    const contactData = { phone, email, location }

    try {
      if (contactInfo && contactInfo.id) {
        await updateContactInfo(contactData).unwrap()
        setSuccess("Contact information updated successfully!")
      } else {
        await addContactInfo(contactData).unwrap()
        setSuccess("Contact information added successfully!")
      }

      setIsUpdating(false)
      refetch()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(`Error: ${err.data?.error || err.message || "Something went wrong"}`)
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleEdit = () => {
    setIsUpdating(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setIsUpdating(false)
    if (contactInfo) {
      setPhone(contactInfo.phone || "")
      setEmail(contactInfo.email || "")
      setLocation(contactInfo.location || "")
    }
    setError("")
    setSuccess("")
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading contact information...</div>
  }

  return (
    <div className={styles["contact-container"]}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {isUpdating || isEditing ? (
        <form onSubmit={handleSubmit} className={styles["contact-form"]}>
          <div className={styles.formGroup}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Contact Number</div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0917-123-4567"
              className={styles.serviceName}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>
              Email Address
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. example@email.com"
              className={styles.serviceName}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>
              Location/Address
            </div>
            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street, Barangay, City, Province"
              rows="3"
              className={styles.serviceDescription}
              required
            />
          </div>

          <div className={styles["update-actions"]}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || isAdding}
              style={{
                padding: "8px 24px",
                backgroundColor: "transparent",
                color: "#1e1b4b",
                border: "2px solid #1e1b4b",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAdding}
              style={{
                padding: "8px 24px",
                backgroundColor: "#1e1b4b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {isSubmitting || isAdding ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles["contact-display"]}>
          <div className={styles["contact-item"]}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Phone</div>
            <div className={styles.serviceName}>{contactInfo?.phone || "Not set"}</div>
          </div>

          <div className={styles["contact-item"]}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>Email</div>
            <div className={styles.serviceName}>{contactInfo?.email || "Not set"}</div>
          </div>

          <div className={styles["contact-item"]}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>Address</div>
            <div className={styles.serviceName}>{contactInfo?.location || "Not set"}</div>
          </div>

          {!isEditing && (
            <div style={{ marginTop: "16px" }}>
              <button
                onClick={handleEdit}
                style={{
                  padding: "8px 24px",
                  backgroundColor: "#1e1b4b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Edit Contact Info
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
