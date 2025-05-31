'use client';

import '../globals.css'
import Link from 'next/link';
import styles from './goobye.module.css';

export default function GoodbyePage() {
  return (
    <section className={styles.goodbyeSection}>
      <div className={styles.card}>
        <h1>Goodbye for now...</h1>
        <p>Your account has been deactivated successfully.</p>
        <p>If you change your mind, you’re always welcome back to the glam squad.</p>
        <Link href="/">
          <button className={styles.homeBtn}>Return to Home</button>
        </Link>
      </div>
    </section>
  );
}