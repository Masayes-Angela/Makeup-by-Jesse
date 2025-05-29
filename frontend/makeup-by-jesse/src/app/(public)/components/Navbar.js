'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

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
    handleScroll() // set initially
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isMounted) return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Makeup <span>by Jesse</span>
      </div>

      <ul className={styles.navLinks}>
        <li><a href="#hero" className={activeLink === 'hero' ? styles.active : ''}>Home</a></li>
        <li><a href="#services" className={activeLink === 'services' ? styles.active : ''}>Services</a></li>
        <li><a href="#about" className={activeLink === 'about' ? styles.active : ''}>About Me</a></li>
        <li><a href="#gallery" className={activeLink === 'gallery' ? styles.active : ''}>Gallery</a></li>
        <li><a href="#reviews" className={activeLink === 'reviews' ? styles.active : ''}>Reviews</a></li>
        <li><a href="#contact" className={activeLink === 'contact' ? styles.active : ''}>Contact</a></li>
        <li><Link href="/faqs" className={styles.link}>FAQS</Link></li>

        {isLoggedIn ? (
          <li className={styles.authArea}>
            <Link href="/track" className={styles.trackLink}>Track Appointment</Link>
            <Image src="/user-icon.png" alt="User Icon" width={28} height={28} className={styles.userIcon} />
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