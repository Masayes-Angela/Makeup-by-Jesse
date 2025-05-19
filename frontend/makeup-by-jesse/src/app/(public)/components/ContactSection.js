'use client';

import styles from '../styles/page.module.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactHeader}>
        <h2>Get In Touch</h2>
        <p>
          We’ll create high-quality linkable content and build at least 40 high-authority links to each asset,
          paving the way for you to grow your rankings, improve brand.
        </p>
      </div>

      <div className={styles.contactWrapper}>
        <div className={styles.contactInfoBox}>
          <h3>Contact Information</h3>
          <h4>We’ll create high-quality linkable content and build at least 40 high-authority.</h4>
          <p><FaPhoneAlt style={{ width: '18px', height: '18px', marginRight: '8px' }}/> 09123456789</p>
          <p><FaEnvelope style={{ width: '18px', height: '18px', marginRight: '8px' }}/> example@gmail.com</p>
          <p><FaMapMarkerAlt style={{ width: '18px', height: '18px', marginRight: '8px' }}/> New York, USA</p>
        </div>

        <div className={styles.contactFormBox}>
          <form className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Subject</label>
              <input type="text" placeholder="Enter your subject" />
            </div>

            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea rows="4" placeholder="Write your message here" />
            </div>

            <button type="submit" className={styles.sendBtn}>Send Message</button>
          </form>
        </div>
      </div>

    </section>
  );
}