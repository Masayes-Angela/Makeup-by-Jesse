"use client"

import "../../globals.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/login.module.css"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Link from "next/link"
import { useRegisterUserMutation } from "@/rtk/authApi"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const [registerUser] = useRegisterUserMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
    setSuccess("")
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return password.length >= minLength && (hasNumber || hasSymbol)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!validatePassword(formData.password)) {
      setError("Password must contain at least 8 characters, including one number or symbol.")
      setIsLoading(false)
      return
    }

    try {
      const { confirmPassword, ...userData } = formData
      console.log("Sending user data:", userData) // Debug log

      const result = await registerUser(userData).unwrap()
      console.log("Registration successful:", result) // Debug log

      setSuccess("Account created successfully! Redirecting to login...")

      // Clear form
      setFormData({
        full_name: "",
        email: "",
        contact_number: "",
        password: "",
        confirmPassword: "",
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err) // Debug log
      setError(err.data?.error || err.error || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.welcome} style={{ color: "#4ac7c5" }}>
            Create Account
          </h2>
          <p className={styles.subtext}>Sign up to continue</p>

          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Success Message */}
              {success && (
                <div
                  className={styles.successMessage}
                  style={{
                    color: "#4ac7c5",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className={styles.errorMessage}
                  style={{
                    color: "#dc3545",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    backgroundColor: "#f8d7da",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="full_name" className={styles.label}>
                    Full Name
                  </label>
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              {/* Email Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              {/* Contact Number Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="contact_number" className={styles.label}>
                    Contact Number
                  </label>
                </div>
                <input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  placeholder="Contact Number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Password Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm Password
                  </label>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <span className={styles.icon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
              </div>

              {/* Password Requirements */}
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginBottom: "1rem",
                  lineHeight: "1.4",
                }}
              >
                Password must contain at least 8 characters, including one number or symbol.
              </p>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{ backgroundColor: "#4ac7c5" }}
                disabled={isLoading}
              >
                {isLoading ? <div className={styles.skeletonButton}></div> : "Sign Up"}
              </button>

              <p className={styles.signup}>
                Already have an Account?{" "}
                <Link href="/auth/login">
                  <span style={{ color: "#4ac7c5" }}>Log In</span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className={styles.right}></div>
      </div>
    </div>
  )
}
