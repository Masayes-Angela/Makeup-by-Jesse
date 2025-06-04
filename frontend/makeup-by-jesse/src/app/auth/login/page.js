'use client'

import '../../globals.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/login.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { TbArrowAutofitLeft } from "react-icons/tb"
import Link from 'next/link'

// ✅ MOCK Data
const mockUsers = [
  { email: 'admin@example.com', password: 'Admin123', role: 'admin' },
  { email: 'sofia@example.com', password: 'SofiaPass123', role: 'user' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const userFound = mockUsers.find(
      (user) => user.email === email && user.password === password
    )

    if (!userFound) {
      setError('Invalid email or password.')
      setIsLoading(false)
      return
    }

    // ✅ Clear form first
    setEmail('')
    setPassword('')
    setIsLoading(false)

    // ✅ Redirect
    if (userFound.role === 'admin') {
      localStorage.setItem('adminToken', 'mock-token'); // 🔐 Save token
      router.push('/admin');
    } else {
      router.push('/');
    }
  }

  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.welcome}>Hello!</h2>
          <p className={styles.subtext}>Log In to your Account</p>

          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
              {/* Email Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  {error && <span className={styles.error}>{error}</span>}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  required
                  className={styles.input}
                />
              </div>

              {/* Password Field */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                </div>

                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    required
                    className={styles.input}
                  />
                  <span className={styles.icon} onClick={togglePassword}>
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>

                <p className={styles.forgotPassword}>
                  <Link href="/auth/forgot-password" prefetch={false}>
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                {isLoading ? (
                  <div className={styles.skeletonButton}></div>
                ) : (
                  'Log In'
                )}
              </button>

              <p className={styles.signup}>
                Don’t have an Account?{' '}
                <Link href="/auth/signup">
                  <span>Sign Up</span>
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