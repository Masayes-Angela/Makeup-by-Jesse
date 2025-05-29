'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import ScrollLink from '../components/NavLink'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    if (pathname !== '/') {
      setActiveLink('') // Clear active scroll highlight on other pages
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

  if (!isMounted) return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Makeup <span>by Jesse</span>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <ScrollLink id="hero" label="Home" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <ScrollLink id="services" label="Services" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <ScrollLink id="about" label="About Me" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <ScrollLink id="gallery" label="Gallery" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <ScrollLink id="reviews" label="Reviews" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <ScrollLink id="contact" label="Contact" activeClass={styles.active} currentActive={activeLink} />
        </li>
        <li>
          <Link
            href="/faqs"
            className={`${styles.link} ${pathname === '/faqs' ? styles.active : ''}`}
          >
            FAQS
          </Link>
        </li>

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