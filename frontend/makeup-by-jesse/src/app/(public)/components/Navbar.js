'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from '../styles/Navbar.module.css'
import ScrollLink from '../components/NavLink'
import { IoPersonCircleSharp, IoPersonSharp, IoLogOutSharp } from 'react-icons/io5'
import { LuBook } from 'react-icons/lu'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const pathname = usePathname()
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/'
  }

  // Highlight current scroll section
  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    if (pathname !== '/') {
      setActiveLink('')
      return
    }

    const handleScroll = () => {
      const sections = ['hero', 'services', 'about', 'gallery', 'reviews', 'contact']
      for (const id of sections) {
        const section = document.getElementById(id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveLink(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown on page navigation (e.g., Manage Profile)
  useEffect(() => {
    setShowDropdown(false)
  }, [pathname])

  if (!isMounted) return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Makeup <span>by Jesse</span>
      </div>

      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <ScrollLink id="hero" label="Home" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <ScrollLink id="services" label="Services" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <ScrollLink id="about" label="About Me" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <ScrollLink id="gallery" label="Gallery" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <ScrollLink id="reviews" label="Reviews" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <ScrollLink id="contact" label="Contact" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li className={styles.navItem}>
          <Link
            href="/faqs"
            className={`${styles.link} ${pathname === '/faqs' ? styles.active : ''}`}
          >
            FAQS
          </Link>
        </li>

        {isLoggedIn ? (
          <li className={styles.authArea}>
            <Link href="/track-appointment" className={styles.trackBtn}>
              <span>Track Appointment</span>
              <span className={styles.trackIconCircle}>
                <LuBook className={styles.trackIcon} />
              </span>
            </Link>

            <div className={styles.profileWrapper} ref={dropdownRef}>
              <IoPersonCircleSharp
                className={styles.userIcon}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <ul className={styles.dropdown}>
                  <li>
                    <IoPersonSharp />
                    <Link href="/profile" className={styles.dropdownLink}>
                      Manage Profile
                    </Link>
                  </li>
                  <li onClick={handleLogout}>
                    <IoLogOutSharp />
                    <span className={styles.dropdownLink}>Logout</span>
                  </li>
                </ul>
              )}
            </div>
          </li>
        ) : (
          <li className={styles.authBtns}>
            <Link href="/auth/signup"><span className={styles.signupBtn}>Sign Up</span></Link>
            <Link href="/auth/login"><span className={styles.loginBtn}>Log In</span></Link>
          </li>
        )}
      </ul>
    </nav>
  )
}