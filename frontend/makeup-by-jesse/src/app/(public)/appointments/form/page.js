"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaChevronDown, FaChevronLeft } from "react-icons/fa"
import styles from "./form.module.css"
import { useCreateAppointmentMutation } from "@/rtk/appointmentsApi"

export default function AppointmentFormPage() {
  const [formData, setFormData] = useState({
    eventType: "",
    paymentMode: "",
    addressLine: "",
    houseNumber: "",
    city: "",
    province: "",
    addressNote: "",
    message: "",
  })

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const router = useRouter()
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation()

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem("userToken")
    const id = localStorage.getItem("userId")
    const name = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")

    // If user is not logged in, redirect to login
    if (!token || !id) {
      router.push("/auth/login?redirect=/appointments")
      return
    }

    setUserId(id)
    setUserName(name || "")
    setUserEmail(email || "")

    // Get selected date and time from localStorage
    const rawDate = localStorage.getItem("selectedDate")
    const time = localStorage.getItem("selectedTime")

    if (!rawDate || !time) {
      router.push("/appointments")
      return
    }

    setSelectedDate(rawDate)
    setSelectedTime(time)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSelectPayment = (value) => {
    setFormData((prev) => ({ ...prev, paymentMode: value }))
    setDropdownOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create appointment data object
      const appointmentData = {
        user_id: userId,
        full_name: userName,
        email: userEmail,
        event_type: formData.eventType,
        payment_mode: formData.paymentMode,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        address_line: formData.addressLine,
        barangay: formData.houseNumber, // Using houseNumber field for barangay
        city: formData.city,
        province: formData.province,
        address_note: formData.addressNote,
        message: formData.message,
      }

      // Submit to database
      const result = await createAppointment(appointmentData).unwrap()

      // Show success modal
      setShowModal(true)

      // Clear localStorage items
      localStorage.removeItem("selectedDate")
      localStorage.removeItem("selectedTime")
    } catch (err) {
      console.error("Failed to create appointment:", err)
      setError(err.data?.error || "Failed to create appointment. Please try again.")
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No Date Selected"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.fullTopRowWrapper}>
        <div className={styles.topRow}>
          <button className={styles.goBackBtn} onClick={() => router.push("/appointments")}>
            <FaChevronLeft className={styles.iconLeft} style={{ marginRight: "0.5rem" }} />
            Go Back
          </button>

          <div className={styles.headingGroup}>
            <h2 className={styles.heading}>Appointment Form</h2>
            <p className={styles.subheading}>Fill in Your Details to Schedule an Appointment</p>
          </div>
        </div>
      </div>

      <div className={styles.formWrapper}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.datetimeDisplay}>
          <span className={styles.dateBox}>{formatDate(selectedDate)}</span>
          <span className={styles.timeText}>{selectedTime || "No Time Selected"}</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <input
              type="text"
              name="eventType"
              placeholder="Event Type"
              value={formData.eventType}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="off"
              disabled={isLoading}
            />

            {/* Custom Dropdown */}
            <div className={styles.dropdown}>
              <div className={styles.selectBox} onClick={() => !isLoading && setDropdownOpen(!dropdownOpen)}>
                <span className={!formData.paymentMode ? styles.placeholder : ""}>
                  {formData.paymentMode || "Mode of Payment"}
                </span>
                <FaChevronDown className={styles.icon} />
              </div>

              {dropdownOpen && (
                <ul className={styles.options}>
                  {["Cash", "GCash", "Bank Transfer", "Credit Card"].map((opt) => (
                    <li key={opt} onClick={() => handleSelectPayment(opt)}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <input
            type="text"
            name="addressLine"
            placeholder="Address Line"
            value={formData.addressLine}
            onChange={handleChange}
            className={styles.input}
            required
            autoComplete="address-line1"
            disabled={isLoading}
          />

          <div className={styles.row}>
            <input
              type="text"
              name="houseNumber"
              placeholder="Barangay"
              value={formData.houseNumber}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-line2"
              disabled={isLoading}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-level2"
              disabled={isLoading}
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-level1"
              disabled={isLoading}
            />
          </div>

          <div className={styles.row}>
            <textarea
              name="addressNote"
              placeholder="Address Note (Optional)"
              value={formData.addressNote}
              onChange={handleChange}
              className={styles.textarea}
              disabled={isLoading}
            />
            <textarea
              name="message"
              placeholder="Additional Message (Optional)"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              disabled={isLoading}
            />
          </div>

          <div className={styles.centerBtn}>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Appointment Submitted!</h3>
            <p className={styles.modalText}>We've received your details. We'll contact you soon.</p>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowModal(false)
                router.push("/")
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
