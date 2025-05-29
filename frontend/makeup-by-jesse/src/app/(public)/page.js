'use client';

import { useEffect } from 'react';
import styles from './styles/page.module.css';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PackagesSection from './components/PackagesSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Delay slightly to ensure all components are rendered first
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <HeroSection />
        <ServicesSection />
        <PackagesSection />
        <AboutSection />
        <GallerySection />
        <ReviewsSection />
        <ContactSection />
      </div>
    </main>
  );
}