'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from '../styles/Navbar.module.css';
import ScrollLink from '../components/NavLink';
import { IoPersonSharp, IoLogOutSharp } from 'react-icons/io5';
import { LuBook } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/rtk/authSlice';
import { persistor } from '@/rtk/store';

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();     // 🧼 clear persisted state
    localStorage.clear();        // 🧼 optional: clear anything else
    window.location.href = '/';  // 🔄 force redirect and reset
  };

  useEffect(() => {
    setIsMounted(true);

    if (pathname !== '/') {
      setActiveLink('');
      return;
    }

    const handleScroll = () => {
      const sections = ['hero', 'services', 'about', 'gallery', 'reviews', 'contact'];
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveLink(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setIsMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Makeup <span>by Jesse</span>
      </div>

      <div className={styles.centerNav}>
        <ul className={styles.navLinks}>
          {['hero', 'services', 'about', 'gallery', 'reviews', 'contact'].map((id) => (
            <li key={id} className={styles.navItem}>
              <ScrollLink id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} activeClass={styles.active} currentActive={activeLink} />
            </li>
          ))}
          <li className={styles.navItem}>
            <Link href="/faqs" className={`${styles.link} ${pathname === '/faqs' ? styles.active : ''}`}>FAQS</Link>
          </li>
        </ul>
      </div>

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
              src={user?.avatar_url || '/no-profile-pic.jpg'}
                alt="User"
                className={styles.userIcon}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <ul className={styles.dropdown}>
                  <li>
                    <IoPersonSharp />
                    <Link href="/profile" className={styles.dropdownLink}>Manage Profile</Link>
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

        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </button>
      </div>

      <div className={`${styles.navWrapper} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          {['hero', 'services', 'about', 'gallery', 'reviews', 'contact'].map((id) => (
            <li key={id} className={styles.navItem}>
              <ScrollLink id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} activeClass={styles.active} currentActive={activeLink} onClick={() => setIsMenuOpen(false)} />
            </li>
          ))}
          <li className={styles.navItem}>
            <Link href="/faqs" onClick={() => setIsMenuOpen(false)} className={`${styles.link} ${pathname === '/faqs' ? styles.active : ''}`}>FAQS</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}