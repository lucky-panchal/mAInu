'use client';
import { useEffect, useRef } from 'react';
import { ScanLine, QrCode, TrendingUp, ChefHat, CreditCard, Building2 } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const FEATURES = [
  {
    icon: <ScanLine size={24} strokeWidth={1.8} />,
    index: '01',
    title: 'Computer-Vision Menu Digitize',
    description: 'Instant optical capture of paper, PDF, or blackboard menus. Extracts item names, dietary flags, descriptions, and pricing in under 60 seconds.',
    tag: 'Core Engine',
  },
  {
    icon: <QrCode size={24} strokeWidth={1.8} />,
    index: '02',
    title: 'Instant Table QR Menus',
    description: 'Dynamic, branded guest-facing digital menus tailored to each table. Zero app install, lightning-fast rendering on all mobile browsers.',
    tag: 'Dine-In',
  },
  {
    icon: <ChefHat size={24} strokeWidth={1.8} />,
    index: '03',
    title: 'Multi-Station KDS Routing',
    description: 'Real-time kitchen order tickets (KOT) sent directly to kitchen station tablets. Eliminate paper slips and track prep elapsed times accurately.',
    tag: 'Kitchen Ops',
  },
  {
    icon: <CreditCard size={24} strokeWidth={1.8} />,
    index: '04',
    title: 'UPI & Card Split-Pay',
    description: 'Guests can review itemized bills, split checks by seat, and pay via dynamic UPI QR or counter cash with automatic GST compliance.',
    tag: 'Settlement',
  },
  {
    icon: <TrendingUp size={24} strokeWidth={1.8} />,
    index: '05',
    title: 'RevPASH & Item Profitability',
    description: 'Track real-time revenue per available seat-hour, kitchen prep bottlenecks, and margin yield to strategically price your top items.',
    tag: 'Analytics',
  },
  {
    icon: <Building2 size={24} strokeWidth={1.8} />,
    index: '06',
    title: 'Central Multi-Outlet Control',
    description: 'Synchronize 86’d items, menu updates, and promotional discounts across all city outlets in one click from the master dashboard.',
    tag: 'Enterprise',
  },
];

export default function FeaturesSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const items = gridRef.current?.querySelectorAll('.anim-item');
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.features}`} id="features">
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} anim-item`}>
          <span className="tag tag-accent">Features</span>
          <h2 className={`display-lg ${styles.heading}`}>
            Everything a modern<br />
            restaurant needs
          </h2>
          <p className={styles.subheading}>
            From a single food truck to a 30-location chain — mAInu handles every workflow,
            so your team can focus on the food.
          </p>
        </div>

        {/* Feature Grid */}
        <div className={styles.grid} ref={gridRef}>
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`${styles.card} anim-item`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>{feature.icon}</div>
                <span className={styles.cardIndex}>{feature.index}</span>
              </div>
              <span className={`tag ${styles.cardTag}`}>{feature.tag}</span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
              <div className={styles.cardArrow}>→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
