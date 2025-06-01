'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from '../styles/Navbar.module.css'
import ScrollLink from '../components/NavLink'
import { IoPersonSharp, IoLogOutSharp } from 'react-icons/io5'
import { LuBook } from 'react-icons/lu'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileImage, setProfileImage] = useState('/no-profile-pic.jpg')

  const pathname = usePathname()
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userProfileImage')
    window.location.href = '/'
  }

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    const savedImage = localStorage.getItem('userProfileImage')
    setIsLoggedIn(!!token)
    if (savedImage) setProfileImage(savedImage)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setShowDropdown(false)
    setIsMenuOpen(false)
  }, [pathname])

  if (!isMounted) return null

  return (
    <nav className={styles.navbar}>
      {/* Left: Logo */}
      <div className={styles.logo}>
        Makeup <span>by Jesse</span>
      </div>

      {/* Center: Nav links (visible on desktop) */}
      <div className={styles.centerNav}>
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
        </ul>
      </div>

      {/* Right: Auth buttons + Hamburger */}
      <div className={styles.rightSide}>
        {isLoggedIn ? (
          <div className={styles.authArea}>
            <Link href="/track-appointment" className={styles.trackBtn}>
              <span>Track Appointment</span>
              <span className={styles.trackIconCircle}>
                <LuBook className={styles.trackIcon} />
              </span>
            </Link>

          <div className={styles.profileWrapper} ref={dropdownRef}>
            <img
              src={profileImage}
              alt="User"
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
          </div>
        ) : (
          <div className={styles.authBtns}>
            <Link href="/auth/signup"><span className={styles.signupBtn}>Sign Up</span></Link>
            <Link href="/auth/login"><span className={styles.loginBtn}>Log In</span></Link>
          </div>
        )}

        {/* Hamburger toggle (mobile only) */}
        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </button>
      </div>

      {/* Slide-down nav links for mobile */}
      <div className={`${styles.navWrapper} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          <li className={styles.navItem}>
            <ScrollLink id="hero" label="Home" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <ScrollLink id="services" label="Services" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <ScrollLink id="about" label="About Me" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <ScrollLink id="gallery" label="Gallery" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <ScrollLink id="reviews" label="Reviews" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <ScrollLink id="contact" label="Contact" activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
          </li>
          <li className={styles.navItem}>
            <Link href="/faqs" onClick={() => setIsMenuOpen(false)} className={`${styles.link} ${pathname === '/faqs' ? styles.active : ''}`}>
              FAQS
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}