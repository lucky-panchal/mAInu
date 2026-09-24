'use client';
import { useEffect, useRef } from 'react';
import styles from './StatsSection.module.css';

const STATS = [
  { value: '45 sec', label: 'Average menu OCR parse', sub: 'Single photo to live database' },
  { value: '14 min', label: 'Faster table turns', sub: 'Direct guest scan-to-order' },
  { value: '+28%', label: 'Average ticket lift', sub: 'Contextual drink & side upselling' },
  { value: '99.98%', label: 'Shift uptime reliability', sub: 'Offline-ready kitchen buffer' },
];

const COMPLIANCE_BADGES = [
  { code: 'FSSAI', title: 'Schedule 4 Compliant', desc: 'Allergen & Veg/Non-Veg Color Coding' },
  { code: 'GSTIN', title: 'HSN / SAC Invoicing', desc: 'Split 2.5% CGST + 2.5% SGST B2C' },
  { code: 'UPI 2.0', title: 'Dynamic QR Settlement', desc: 'Zero-MDR Direct Bank Reconciliation' },
  { code: 'ESC/POS', title: 'Thermal Print Standard', desc: 'Native 80mm & 58mm KOT Direct-to-Port' },
  { code: 'MULTI-OUTLET', title: 'Master Brand Control', desc: 'Central 86’d Synced in Realtime' },
];

export default function StatsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const items = sectionRef.current?.querySelectorAll('.anim-item');
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Stats Row */}
      <div className={`${styles.statsRow} anim-item`}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.value} className={styles.statItem}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSub}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indian F&B Ecosystem & Standards */}
      <div className={`${styles.trustedSection} anim-item`}>
        <div className="container">
          <p className={styles.trustedLabel}>Architected for Indian F&amp;B Regulatory &amp; Hardware Standards</p>
        </div>
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            {[...COMPLIANCE_BADGES, ...COMPLIANCE_BADGES].map((badge, i) => (
              <div key={i} className={styles.marqueeItem}>
                <span className={styles.badgeCode}>{badge.code}</span>
                <span className={styles.badgeTitle}>{badge.title}</span>
                <span className={styles.badgeDesc}>{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
