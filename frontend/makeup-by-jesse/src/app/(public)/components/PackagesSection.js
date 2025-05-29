'use client'
import { useState, useEffect, useRef } from 'react'
import styles from '../styles/Packages.module.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function PackagesSection() {
  const [packages, setPackages] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const tabListRef = useRef(null)

  useEffect(() => {
    const mockPackages = [
      { package: 'SQUAD GOALS BEAUTY', description: 'hello', image: '/gallery/img1.jpg' },
      { package: 'CLASSIC WEDDING', description: 'hi', image: '/gallery/img4.jpg' },
      { package: 'BRIDAL MAKEUP', description: 'b0ss m4paGm@haL', image: '/gallery/img5.jpg' },
      { package: 'PRENUP PHOTOSHOOT', description: 'wassup', image: '/gallery/img2.jpg' },
    ]
    setPackages(mockPackages)
  }, [])

  const scrollTabs = (direction) => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({
        left: direction === 'left' ? -208 : 208,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className={styles.packages}>
      <p className={styles.subheading}>Our Beauty Sets</p>
      <h2 className={styles.heading}>Special Price Packages</h2>

      <div className={styles.tabCarousel}>
        {packages.length > 4 && (
          <button onClick={() => scrollTabs('left')} className={styles.navBtn}>
            <FaChevronLeft />
          </button>
        )}

        <div className={styles.tabsWrapper} ref={tabListRef}>
          {packages.map((pkg, index) => (
            <button
              key={index}
              className={`${styles.tab} ${index === activeIndex ? styles.activeTab : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className={styles.title}>{pkg.package}</span>
              <span className={styles.subtitle}>PACKAGE</span>
            </button>
          ))}
        </div>

        {packages.length > 4 && (
          <button onClick={() => scrollTabs('right')} className={styles.navBtn}>
            <FaChevronRight />
          </button>
        )}
      </div>

      {packages[activeIndex] && (
        <div className={styles.packageContent}>
          <div className={styles.imageBox}>
            <img
              src={packages[activeIndex].image}
              alt={packages[activeIndex].package}
              className={styles.image}
            />
          </div>
          <div className={styles.details}>
            <h3 className={styles.packageTitle}>
              <span className={styles.packageName}>{packages[activeIndex].package}</span>{' '}
              <span className={styles.packageLabel}>PACKAGE</span>
            </h3>
          <div className={styles.descriptionText}>
            {packages[activeIndex].description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          </div>
        </div>
      )}
    </section>
  )
}