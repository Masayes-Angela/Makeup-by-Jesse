'use client'
import { useState, useEffect, useRef } from 'react'
import styles from '../styles/Packages.module.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useGetPackagesQuery } from '@/rtk/packageApi'

export default function PackagesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabListRef = useRef(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Fetch packages from API instead of using mock data
  const { data: packages = [], isLoading, isError } = useGetPackagesQuery()
  
  // Filter only active packages
  const activePackages = packages.filter(pkg => pkg.status === 'ACTIVE')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollTabs = (direction) => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({
        left: direction === 'left' ? -233 : 233,
        behavior: 'smooth',
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <section ref={sectionRef} className={`${styles.packages} ${styles.fadeInZoom} ${isVisible ? styles.visible : ''}`}>
        <p className={`${styles.subheading}`}>Our Beauty Sets</p>
        <h2 className={`${styles.heading}`}>Special Price Packages</h2>
        <div className={styles.packageContent}>
          <p>Loading packages...</p>
        </div>
      </section>
    )
  }

  // Show error state
  if (isError) {
    return (
      <section ref={sectionRef} className={`${styles.packages} ${styles.fadeInZoom} ${isVisible ? styles.visible : ''}`}>
        <p className={`${styles.subheading}`}>Our Beauty Sets</p>
        <h2 className={`${styles.heading}`}>Special Price Packages</h2>
        <div className={styles.packageContent}>
          <p>Error loading packages. Please try again later.</p>
        </div>
      </section>
    )
  }

  // Show no packages state
  if (activePackages.length === 0) {
    return (
      <section ref={sectionRef} className={`${styles.packages} ${styles.fadeInZoom} ${isVisible ? styles.visible : ''}`}>
        <p className={`${styles.subheading}`}>Our Beauty Sets</p>
        <h2 className={`${styles.heading}`}>Special Price Packages</h2>
        <div className={styles.packageContent}>
          <p>No packages available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className={`${styles.packages} ${styles.fadeInZoom} ${isVisible ? styles.visible : ''}`}>
      <p className={`${styles.subheading}`}>Our Beauty Sets</p>
      <h2 className={`${styles.heading}`}>Special Price Packages</h2>

      <div className={styles.tabCarousel}>
        {activePackages.length > 4 && (
          <button onClick={() => scrollTabs('left')} className={styles.navBtn}>
            <FaChevronLeft />
          </button>
        )}

        <div className={styles.tabsWrapper} ref={tabListRef}>
          {activePackages.map((pkg, index) => (
            <button
              key={pkg.id}
              className={`${styles.tab} ${index === activeIndex ? styles.activeTab : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className={styles.title}>{pkg.name}</span>
              <span className={styles.subtitle}>PACKAGE</span>
            </button>
          ))}
        </div>

        {activePackages.length > 4 && (
          <button onClick={() => scrollTabs('right')} className={styles.navBtn}>
            <FaChevronRight />
          </button>
        )}
      </div>

      {activePackages[activeIndex] && (
        <div className={styles.packageContent}>
          <div className={styles.imageBox}>
            <img
              src={activePackages[activeIndex].image_url ? `http://localhost:8080${activePackages[activeIndex].image_url}` : '/placeholder.svg?height=360&width=400'}
              alt={activePackages[activeIndex].name}
              className={styles.image}
              onError={(e) => {
                e.target.src = '/placeholder.svg?height=360&width=400'
                e.target.onerror = null
              }}
            />
          </div>
          <div className={styles.details}>
            <h3 className={styles.packageTitle}>
              <span className={styles.packageName}>{activePackages[activeIndex].name}</span>{' '}
              <span className={styles.packageLabel}>PACKAGE</span>
            </h3>
            <div className={styles.descriptionText}>
              {activePackages[activeIndex].description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}