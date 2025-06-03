'use client';
import { useState } from 'react';
import styles from '../styles/Faqs.module.css';
import { MdArrowOutward } from "react-icons/md";

const faqs = [
  {
    question: 'Ridiculus adipiscing netus erat mi sodales pellentesque ?',
    answer: 'Sit massa habitant nec aliquet congue vehicula feugiat enim pretium lobortis pede tincidunt turpis arcu posuere cursus diam sodales nunc malesuada .',
  },
  { question: 'Cursus aenean et si accumsan maximus maecenas ?', answer: 'secret' },
  { question: 'Commodo etiam aptent pellentesque si sit consectetur ?', answer: 'secret' },
  { question: 'Semper inceptos consectetuer tortor adipiscing sit eu ?', answer: 'secret' },
  { question: 'Augue venenatis vestibulum nibh letius torquent tempor ?', answer: 'secret' },
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