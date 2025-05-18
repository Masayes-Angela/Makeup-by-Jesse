'use client';

import styles from '../styles/page.module.css';

const aboutData = {
  image: '/about.jpg',
  description:
    'Hi! I’m Jesse, a professional HMUA offering glam transformations for special moments. I’m passionate about helping women feel their most confident and radiant during life’s most unforgettable occasions.',
};

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutImage}>
        <img src={aboutData.image} alt="About Jesse" />
      </div>
      <div className={styles.aboutText}>
        <h2>About Me</h2>
        <p>{aboutData.description}</p>
      </div>
    </section>
  );
}
