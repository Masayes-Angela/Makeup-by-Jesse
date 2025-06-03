'use client'

import { useState } from 'react'
import styles from './content.module.css'
import { BiSolidEditAlt } from 'react-icons/bi'

// Import each tab section component
import ServicesAndPackages from './components/ServicesAndPackages'
// You will create these next:
import AboutSection from './components/AboutSection'
import GallerySection from './components/GallerySection'
import ReviewsSection from './components/ReviewsSection'
import ContactSection from './components/ContactSection'

export default function ManageWebsite() {
  const [activeTab, setActiveTab] = useState('services')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesAndPackages />
      case 'about':
        return <AboutSection />
      case 'gallery':
        return <GallerySection />
      case 'reviews':
        return <ReviewsSection />
      case 'contacts':
        return <ContactSection />
      default:
        return <div className={styles['content-section']}><p>Select a tab to view content.</p></div>
    }
  }

  return (
    <div className={styles['manage-website']}>
      <div className={styles.container}>
        <div className={styles['icon-container']}><BiSolidEditAlt /></div>
        <h1>Manage Website Content</h1>
      </div>

      <nav className={styles['mw-nav']}>
        <button onClick={() => setActiveTab('services')} className={activeTab === 'services' ? styles.active : ''}>
          Services & Packages
        </button>
        <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? styles.active : ''}>
          About Me
        </button>
        <button onClick={() => setActiveTab('gallery')} className={activeTab === 'gallery' ? styles.active : ''}>
          Gallery
        </button>
        <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? styles.active : ''}>
          Reviews
        </button>
        <button onClick={() => setActiveTab('contacts')} className={activeTab === 'contacts' ? styles.active : ''}>
          Contacts
        </button>
      </nav>

      <div className={styles['tab-content-container']}>
        {renderTabContent()}
      </div>
    </div>
  )
}