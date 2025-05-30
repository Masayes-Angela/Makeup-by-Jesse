'use client'

import '../../globals.css'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from '../styles/resetpassword.module.css'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')?.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const isValidPassword = (pw) => {
      return pw.length >= 8 && /[0-9!@#$%^&*]/.test(pw)
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill out all fields.')
      return
    }

    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters and contain a number or special character.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setSubmitted(true)
  }

  if (!token) {
    return <p style={{ padding: '2rem' }}>Invalid or missing token.</p>
  }

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.resetContainer}>
        <h2 className={styles.heading}>Reset Password</h2>
        <p className={styles.subtext}>Please enter your new password below.</p>

        {submitted ? (
          <div className={styles.successMessage}>
            Password reset successful! <br />
            <Link href="/auth/login" style={{ color: '#3dbac2', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* General error message */}
            {error && (
              <div style={{
                marginTop: '1rem',
                marginBottom: '1.5rem',
                background: '#fff4f4',
                border: '1px solid #f0bcbc',
                color: '#d93025',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                textAlign: 'left'
              }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" className={styles.button}>
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}