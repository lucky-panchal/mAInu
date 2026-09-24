'use client';
import { useEffect, useRef } from 'react';
import styles from './CTASection.module.css';

export default function CTASection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );
    const items = sectionRef.current?.querySelectorAll('.anim-item');
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.inner} anim-item`}>
          {/* Glow */}
          <div className={styles.glow1} />
          <div className={styles.glow2} />

          <div className={styles.content}>
            <div className={styles.eyebrow}>✦ Start Today. Free Forever.</div>
            <h2 className={`display-lg ${styles.heading}`}>
              Your restaurant's digital<br />future starts now.
            </h2>
            <p className={styles.sub}>
              Join hundreds of restaurants already using mAInu to serve smarter,
              sell more, and scale faster.
            </p>

            <div className={styles.actions}>
              <a href="#pricing" className="btn btn-primary">
                Launch Your Menu →
              </a>
              <a href="#how-it-works" className="btn btn-outline-white">
                See How It Works
              </a>
            </div>

            <div className={styles.trust}>
              <span>✓ Free forever tier</span>
              <span>·</span>
              <span>✓ No credit card</span>
              <span>·</span>
              <span>✓ Setup in 2 mins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
