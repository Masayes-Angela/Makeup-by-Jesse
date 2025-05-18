'use client';

import styles from './styles/page.module.css';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PackagesSection from './components/PackagesSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';

export default function Home() {
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