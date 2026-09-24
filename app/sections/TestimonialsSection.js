'use client';
import { useEffect, useRef } from 'react';
import styles from './TestimonialsSection.module.css';

const TESTIMONIALS = [
  {
    metric: '38m Avg Turn',
    delta: '↓ 16m faster table turns',
    quote: 'During Saturday dinner rush, our 8 stewards used to spend half their time running handwritten KOTs to the kitchen. With table QR ordering, tickets print directly at our tandoor and curry stations.',
    name: 'Chef Raghavendra Rao',
    role: 'Executive Chef & Partner',
    restaurant: 'Dakshin Heritage (120 Seats), Indiranagar, Bangalore',
    badge: 'Fine Dining',
  },
  {
    metric: '+₹140 AOV Lift',
    delta: '↑ 22% higher beverage attach',
    quote: 'mAInu’s contextual upselling triggers at the exact right moment — suggesting mocktails and extra breads before checkout. Our beverage attachment jumped without waiters having to memorize upsell scripts.',
    name: 'Siddharth Sen',
    role: 'Director of Food & Beverage',
    restaurant: 'The Cultured Hearth, Bandra West, Mumbai',
    badge: 'Microbrewery & Kitchen',
  },
  {
    metric: 'Zero 86’d Errors',
    delta: '100% real-time menu sync',
    quote: 'When we ran out of Black Cod at 9 PM on a packed Friday, the kitchen 86’d it from the KDS tablet. It vanished from every guest’s phone menu immediately. No awkward server apologies at tables.',
    name: 'Ananya Deshmukh',
    role: 'General Manager',
    restaurant: 'Bistro O Pedro, Koregaon Park, Pune',
    badge: 'Contemporary Bistro',
  },
  {
    metric: '4-Outlet Sync',
    delta: 'Centralized menu administration',
    quote: 'Managing dynamic seasonal menus across our 4 cloud kitchens used to mean manual CSV uploads into 3 different aggregators. Now we update prices centrally and thermal receipts print with correct GST.',
    name: 'Kabeer Ahluwalia',
    role: 'Head of Operations',
    restaurant: 'Urban Curry Project, Cyber City, Gurugram',
    badge: 'Multi-Outlet QSR',
  },
];

export default function TestimonialsSection() {
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
    <section className={`section ${styles.section}`} ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} anim-item`}>
          <span className="tag tag-accent">Operator Field Reports</span>
          <h2 className={`display-lg ${styles.heading}`}>
            Field-tested in high-volume<br />Indian dining rooms
          </h2>
          <p className={styles.subheading}>
            Real kitchen workflows, real table turns, and real F&amp;B margins — measured during peak dinner shifts.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className={styles.caseGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`${styles.card} anim-item`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className={styles.cardHeaderRow}>
                <div>
                  <div className={styles.metricVal}>{t.metric}</div>
                  <div className={styles.metricDelta}>{t.delta}</div>
                </div>
                <span className={styles.outletBadge}>{t.badge}</span>
              </div>

              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>

              <div className={styles.authorSection}>
                <div className={styles.authorName}>{t.name}</div>
                <div className={styles.authorRole}>{t.role}</div>
                <div className={styles.authorRestaurant}>{t.restaurant}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
