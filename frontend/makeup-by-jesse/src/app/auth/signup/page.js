'use client'

import '../../globals.css'
import { useState } from 'react'
import styles from '../styles/signup.module.css'
import { AiOutlineClose, AiOutlineCheck, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import Link from 'next/link'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const validatePassword = (pw) => {
    return pw.length >= 8 && /[0-9!@#$%^&*]/.test(pw)
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!fullName || !email || !contact || !password || !confirmPassword) {
    setError('Please fill in all fields.')
    return
  }

  if (!validatePassword(password)) {
    setError('Password must be at least 8 characters and include a number or symbol.')
    return
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  // ✅ TEMPORARY MOCK RESPONSE BEFORE BACKEND IS READY
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful signup
    setShowModal(true)
    setFullName('')
    setEmail('')
    setContact('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  } catch (err) {
    setError('Something went wrong. Please try again.')
  }
}

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.left}></div>

        {/* Right Panel */}
        <div className={styles.right}>
          <h2 className={styles.welcome}>Create Account</h2>

          <div className={styles.formWrapper}>
            <p className={styles.subtextTop}>Sign up to continue</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (error) setError('')
                  }}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={styles.input}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  className={styles.input}
                  autoComplete="tel"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value)
                    if (error) setError('')
                  }}
                />
              </div>

              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={styles.input}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                />
                <span
                  className={styles.icon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>

              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className={styles.input}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (error) setError('')
                  }}
                />
                <span
                  className={styles.icon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>

              {!error && (
                <p className={styles.passwordNote}>
                  Password must contain at least 8 characters, including one number or symbol.
                </p>
              )}

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.signupBtn}>
                Sign Up
              </button>
            </form>

            <p className={styles.login}>
              Already have an Account?{' '}
              <Link href="/auth/login">
                <span>Log In</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose />
            </button>
            <div className={styles.iconWrapper}>
              <AiOutlineCheck className={styles.checkIcon} />
            </div>
            <h3>Account created!</h3>
            <p>You may now proceed to log in.</p>
          </div>
        </div>
      )}
    </div>
  )
}