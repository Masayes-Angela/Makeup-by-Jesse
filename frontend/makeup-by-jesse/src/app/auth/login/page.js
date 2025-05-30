'use client'

import '../../globals.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/login.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { TbArrowAutofitLeft } from "react-icons/tb";
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // ✅ Mock user data
  const mockUsers = [
    { email: 'admin@example.com', password: 'Admin123', role: 'admin' },
    { email: 'sofia@example.com', password: 'SofiaPass123', role: 'user' },
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    const userFound = mockUsers.find(
      (user) => user.email === email && user.password === password
    )

    if (!userFound) {
      setError('Invalid email or password.')
      return
    }

    // ✅ Use role to redirect
    if (userFound.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }

    setEmail('')
    setPassword('')
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
                  type="email"
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
                    type={showPassword ? 'text' : 'password'}
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

                <p className={styles.forgot}>Forgot your password?</p>
              </div>

              <button type="submit" className={styles.loginBtn}>
                Log In
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
                  Go Back
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