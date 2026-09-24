'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './FAQSection.module.css';

const FAQS = [
  {
    q: 'How quickly can I get my restaurant live?',
    a: 'Most restaurants are live in under 2 minutes. Just scan your existing menu (paper or PDF), and our AI does the rest. You get a shareable QR code immediately.',
  },
  {
    q: 'Do my guests need to download an app?',
    a: 'No. Guests simply scan your QR code with their phone camera and the menu opens instantly in their browser. Zero friction, zero downloads.',
  },
  {
    q: 'Can I update my menu prices or items?',
    a: 'Yes — instantly. Any change you make in the mAInu dashboard syncs across all your QR menus, KDS displays, and digital screens in real-time.',
  },
  {
    q: 'Does mAInu work with my existing POS system?',
    a: 'mAInu integrates with major POS systems. Our Enterprise plan includes full API access for custom integrations. Contact us to check compatibility.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data is yours. You can export your full menu, order history, and analytics at any time. We retain data for 90 days after cancellation so you can retrieve it.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes! All paid plans include a 14-day free trial with full access to every feature. No credit card required to start.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const items = sectionRef.current?.querySelectorAll('.anim-item');
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.section}`} id="faq" ref={sectionRef}>
      <div className="container">
        <div className={styles.layout}>
          {/* Left */}
          <div className={`${styles.left} anim-item`}>
            <span className="tag tag-accent">FAQ</span>
            <h2 className={`display-md ${styles.heading}`}>
              Questions?<br />We have answers.
            </h2>
            <p className={styles.sub}>
              Still have something on your mind?{' '}
              <a href="mailto:hello@mainu.in" className={styles.emailLink}>
                Email us →
              </a>
            </p>
          </div>

          {/* Right: Accordion */}
          <div className={styles.accordion}>
            {FAQS.map((item, i) => (
              <div
                key={i}
                className={`${styles.item} anim-item`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <button
                  className={styles.question}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span>{item.q}</span>
                  <span className={`${styles.icon} ${openIndex === i ? styles.iconOpen : ''}`}>+</span>
                </button>
                <div
                  className={styles.answer}
                  style={{
                    maxHeight: openIndex === i ? '300px' : '0',
                    opacity: openIndex === i ? 1 : 0,
                  }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
