"use client"

import { useEffect, useState } from "react"
import { useGetContactInfoQuery } from "@/rtk/contactApi"
import styles from "../styles/Contact.module.css"
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

export default function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { data: contactInfo, isLoading: isLoadingContact } = useGetContactInfoQuery()

  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedName = localStorage.getItem("userName")
    const savedEmail = localStorage.getItem("userEmail")

    if (token && savedName && savedEmail) {
      setIsLoggedIn(true)
      setName(savedName)
      setEmail(savedEmail)
    }
  }, [])

  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")

    if (!name || !email || !subject || !message) {
      setErrorMsg("Please fill in all fields.")
      setTimeout(() => setErrorMsg(""), 4000)
      return
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email.")
      setTimeout(() => setErrorMsg(""), 4000)
      return
    }

    setIsLoading(true)

    try {
      // Simulated backend call — replace with actual fetch/axios
      await new Promise((res) => setTimeout(res, 1500))

      setSuccessMsg("Your message has been sent successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)

      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.")
      setTimeout(() => setErrorMsg(""), 4000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactHeader}>
        <h2>Get In Touch</h2>
        <p>
          Have questions about our services or need help deciding which service fits you best? We're always happy to
          help. Just leave us a message and we'll get in touch with you shortly.
        </p>
      </div>

      <div className={styles.contactWrapper}>
        <div className={styles.contactInfoBox}>
          <h3>Contact Information</h3>
          <h4>We'll create high-quality linkable content and build at least 40 high-authority.</h4>

          {isLoadingContact ? (
            <p>Loading contact information...</p>
          ) : (
            <>
              <p>
                <FaPhoneAlt style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                {contactInfo?.phone || "Phone not available"}
              </p>
              <p>
                <FaEnvelope style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                {contactInfo?.email || "Email not available"}
              </p>
              <p>
                <FaMapMarkerAlt style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                {contactInfo?.location || "Address not available"}
              </p>
            </>
          )}
        </div>

        <div className={styles.contactFormBox}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            {!isLoggedIn && (
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactName">Name</label>
                  <input
                    id="contactName"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="contactSubject">Subject</label>
              <input
                id="contactSubject"
                type="text"
                name="subject"
                placeholder="Enter your subject"
                autoComplete="off"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactMessage">Message</label>
              <textarea
                id="contactMessage"
                name="message"
                rows="4"
                placeholder="Write your message here"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <button type="submit" className={styles.sendBtn} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
