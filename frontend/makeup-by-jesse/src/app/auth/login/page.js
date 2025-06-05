"use client"

import "../../globals.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/login.module.css"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { TbArrowAutofitLeft } from "react-icons/tb"
import Link from "next/link"
import { useLoginUserMutation } from "@/rtk/authApi"

// ✅ MOCK Data for Admin (keeping this as requested)
const mockAdminUsers = [{ email: "admin@example.com", password: "Admin123", role: "admin" }]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const [loginUser] = useLoginUserMutation()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // First check if it's an admin login (mock data)
      const adminFound = mockAdminUsers.find((user) => user.email === email && user.password === password)

      if (adminFound) {
        // Admin login with mock data
        console.log("Admin login successful")
        localStorage.setItem("adminToken", "mock-admin-token")
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", email)

        setSuccess("Admin login successful! Redirecting...")

        // Clear form
        setEmail("")
        setPassword("")

        // Redirect to admin dashboard after short delay
        setTimeout(() => {
          router.push("/admin")
        }, 1000)

        setIsLoading(false)
        return
      }

      // If not admin, try database login for regular users
      console.log("Attempting database login for:", email)
      const result = await loginUser({ email, password }).unwrap()
      console.log("Database login successful:", result)

      // Success - store token and user info
      localStorage.setItem("userToken", result.token)
      localStorage.setItem("userRole", result.user.role)
      localStorage.setItem("userId", result.user.id.toString())
      localStorage.setItem("userName", result.user.full_name)
      localStorage.setItem("userEmail", result.user.email)

      setSuccess("Login successful! Redirecting...")

      // Clear form
      setEmail("")
      setPassword("")

      // Redirect based on role after short delay
      setTimeout(() => {
        if (result.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/") // Redirect to home page for regular users
        }
      }, 1000)
    } catch (err) {
      console.error("Login error:", err)
      // Handle different types of errors
      if (err.status === 401) {
        setError("Invalid email or password. Please try again.")
      } else if (err.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError(err.data?.error || err.error || "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePassword = () => setShowPassword(!showPassword)

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    setError("") // Clear error when user starts typing
    setSuccess("") // Clear success message when user starts typing
  }

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.welcome} style={{ color: "#4ac7c5" }}>
            Hello!
          </h2>
          <p className={styles.subtext}>Log In to your Account</p>

          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
              {/* Success Message */}
              {success && (
                <div
                  className={styles.successMessage}
                  style={{
                    color: "#4ac7c5",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    backgroundColor: "#d4edda",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  {success}
                </div>
              )}

              {/* Email Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  {error && (
                    <span className={styles.error} style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                      {error}
                    </span>
                  )}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  required
                  className={styles.input}
                  disabled={isLoading}
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
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    required
                    className={styles.input}
                    disabled={isLoading}
                  />
                  <span
                    className={styles.icon}
                    onClick={togglePassword}
                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>

                {/* Forgot Password link - keeping as requested but can be ignored */}
                <p className={styles.forgotPassword}>
                  <Link href="/auth/forgot-password" prefetch={false}>
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{ backgroundColor: "#4ac7c5" }}
                disabled={isLoading}
              >
                {isLoading ? <div className={styles.skeletonButton}>Logging in...</div> : "Log In"}
              </button>

              <p className={styles.signup}>
                {"Don't have an Account? "}
                <Link href="/auth/signup">
                  <span style={{ color: "#4ac7c5" }}>Sign Up</span>
                </Link>
              </p>

              <p className={styles.backLink}>
                <Link href="/">
                  <TbArrowAutofitLeft className={styles.arrowIcon} />
                  Back to Home
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
