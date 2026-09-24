'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './PricingSection.module.css';

const PLANS = [
  {
    name: 'Starter',
    price: '₹0',
    period: 'forever free',
    description: 'Perfect for a single outlet getting started with digital menus.',
    features: [
      '1 restaurant outlet',
      'AI menu scan (up to 50 items)',
      'QR digital menu',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
    href: '/signup?plan=starter',
    badge: null,
  },
  {
    name: 'Pro',
    price: '₹2,499',
    period: 'per month',
    description: 'For growing restaurants that want the full power of mAInu.',
    features: [
      'Unlimited menu items',
      'Scan-to-order & payments',
      'Kitchen Display System (KDS)',
      'Real-time analytics & AI insights',
      'Staff management & scheduling',
      'Custom branded menu themes',
      'Priority support',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaStyle: 'primary',
    href: '/signup?plan=pro',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For chains, hotel groups, and multi-location operations.',
    features: [
      'Unlimited locations',
      'Centralized multi-outlet dashboard',
      'Advanced analytics & reporting',
      'API & POS integrations',
      'White-label options',
      'Dedicated account manager',
      'SLA & uptime guarantee',
    ],
    cta: 'Talk to Sales',
    ctaStyle: 'secondary',
    href: '/signup?plan=enterprise',
    badge: null,
  },
];

export default function PricingSection() {
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
    <section className={`section ${styles.section}`} id="pricing" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} anim-item`}>
          <span className="tag tag-accent">Pricing</span>
          <h2 className={`display-lg ${styles.heading}`}>
            Simple, honest pricing
          </h2>
          <p className={styles.subheading}>
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`${styles.card} ${plan.badge ? styles.featured : ''} anim-item`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.badge && (
                <div className={styles.badge}>{plan.badge}</div>
              )}
              <div className={styles.cardTop}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>/{plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>

              <div className={styles.divider} />

              <ul className={styles.features}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.feature}>
                    <span className={styles.checkIcon}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`btn ${
                  plan.ctaStyle === 'primary' ? 'btn-primary' :
                  plan.ctaStyle === 'secondary' ? 'btn-secondary' : 'btn-outline'
                } ${styles.cta}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className={`${styles.footerNote} anim-item`}>
          All plans include a <strong>14-day free trial</strong>. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
