'use client'

import '../../globals.css'
import { useState } from 'react'
import styles from '../styles/login.module.css'
import Link from 'next/link'
import { AiOutlineCheckCircle } from 'react-icons/ai'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate email sending
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.heading}>Forgot Password?</h2>
          <p className={styles.subheading}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className={styles.formWrapper}>
            {submitted ? (
              <>
                <div className={styles.successMessage}>
                  <AiOutlineCheckCircle style={{ color: '#4ac7c5', fontSize: '1.4rem', marginRight: '0.4rem' }} />
                  If the email exists, you’ll get a reset link shortly.
                </div>

                <p className={styles.backLink2}>
                  <Link href="/auth/login">Back to Login</Link>
                </p>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.loginBtn}
                  disabled={submitted}
                >
                  Send Reset Link
                </button>

                <p className={styles.backLink2}>
                  <Link href="/auth/login" prefetch={false}>
                    Back to Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className={styles.right}></div>
      </div>
    </div>
  )
}