'use client';
import { useState } from 'react';
import styles from '../styles/Faqs.module.css';
import { MdArrowOutward } from "react-icons/md";

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'Just click "Book Now" button, choose your preferred date and time, and fill out the form with your details. If the slot is available, we’ll confirm your booking through email or SMS!',
  },
  {
    question: 'Do I need to pay a deposit to confirm my booking?',
    answer: 'Nope! No upfront payment is required. Just show up on time for your appointment and pay after your glam session — easy and stress-free.'
  },
  {
    question: 'What happens if I need to cancel or reschedule?',
    answer: 'We totally understand! You can reschedule or cancel your appointment through your confirmation email, or just send us a message at least 24 hours in advance.'
  },
  {
    question: 'What should I do before my makeup session?',
    answer: 'Arrive with a clean, moisturized face. Avoid using heavy skincare or SPF right before the session to help the makeup stick better and last longer!'
  },
  {
    question: 'Do you offer makeup services for out-of-town events?',
    answer: 'Yes, we do!'
  },
  {
    question: 'Can I bring a companion during my appointment?',
    answer: 'Of course! Just let us know ahead so we can accommodate them in our studio space — we want everyone to be comfy during your glam time.'
  },
];

export default function FaqSection() {
  const [openStates, setOpenStates] = useState(faqs.map(() => false));

  const toggleFAQ = (index) => {
    setOpenStates((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>FAQs</h1>
        <p className={styles.heroSubtitle}>
          Got questions? We’ve got the answers.
        </p>
      </section>

      {/* FAQs Section */}
      <section className={styles.faqWrapper}>
        <p className={styles.subheading}>Common Question</p>
        <h2 className={styles.heading}>Most Popular Questions</h2>

        <div className={styles.faqList}>
          <div className={styles.column}>
            {faqs.filter((_, i) => i % 2 === 0).map((faq, index) => {
              const realIndex = index * 2;
              return (
                <div
                  key={realIndex}
                  className={`${styles.faqItem} ${openStates[realIndex] ? styles.open : ''}`}
                >
                  <div
                    className={styles.question}
                    onClick={() => toggleFAQ(realIndex)}
                  >
                    <span>{faq.question}</span>
                    <MdArrowOutward className={styles.icon} />
                  </div>
                  {openStates[realIndex] && faq.answer && (
                    <p className={styles.answer}>{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.column}>
            {faqs.filter((_, i) => i % 2 === 1).map((faq, index) => {
              const realIndex = index * 2 + 1;
              return (
                <div
                  key={realIndex}
                  className={`${styles.faqItem} ${openStates[realIndex] ? styles.open : ''}`}
                >
                  <div
                    className={styles.question}
                    onClick={() => toggleFAQ(realIndex)}
                  >
                    <span>{faq.question}</span>
                    <MdArrowOutward className={styles.icon} />
                  </div>
                  {openStates[realIndex] && faq.answer && (
                    <p className={styles.answer}>{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}