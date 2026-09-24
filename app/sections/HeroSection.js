'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanLine, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const heroRef = useRef(null);
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["Fast & Seamless", "AI-Powered", "Revenue-Boosting", "Peak-Shift Ready", "Effortless"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2400);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

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
    const items = heroRef.current?.querySelectorAll('.anim-item');
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className="container">
        {/* Hero Top Content */}
        <div className={`${styles.content} anim-item`}>
          <div className={styles.badgeWrapper}>
            <span className="tag tag-accent">
              <Sparkles size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              Autonomous Restaurant Operating System
            </span>
          </div>

          <h1 className={`display-xl ${styles.title}`}>
            <span style={{ display: 'block' }}>Digital Dining That Is</span>
            <span
              style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                height: '1.35em',
                color: 'var(--color-terracotta, #C85A32)',
                padding: '2px 0',
              }}
            >
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  style={{
                    position: 'absolute',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -60 : 60, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className={styles.subtitle}>
            Transform any paper menu into a multi-station digital dining experience in 45 seconds.
            Faster table turns, higher beverage attachment, and real-time KDS kitchen routing.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button size="lg" className={`btn btn-primary ${styles.ctaBtn}`}>
                Start Free Forever <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </Button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="outline" className={`btn btn-outline ${styles.ctaOutlineBtn}`}>
                Explore Kitchen Flow
              </Button>
            </a>
          </div>

          <div className={styles.trustBadges}>
            <span className={styles.trustItem}>✓ Zero hardware lock-in</span>
            <span className={styles.trustDot}>•</span>
            <span className={styles.trustItem}>✓ ESC/POS thermal compatible</span>
            <span className={styles.trustDot}>•</span>
            <span className={styles.trustItem}>✓ FSSAI &amp; GST compliant</span>
          </div>
        </div>

        {/* Hero Visual Banner Showcase */}
        <div className={`${styles.visualWrapper} anim-item`}>
          {/* Desktop Visual */}
          <div className={styles.desktopVisual}>
            <Image
              src="/images/landing_page_web.png"
              alt="mAInu restaurant operating system"
              width={1600}
              height={900}
              className={styles.heroImage}
              priority
            />
            {/* Floating feature cards */}
            <div className={`${styles.floatingCard} ${styles.cardLeft}`}>
              <div className={styles.cardIcon}>
                <ScanLine size={18} strokeWidth={2} />
              </div>
              <div>
                <div className={styles.cardTitle}>Vision Menu Digitize</div>
                <div className={styles.cardSubtitle}>50+ dishes recognized in 45s</div>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.cardRight}`}>
              <div className={styles.cardIcon}>
                <TrendingUp size={18} strokeWidth={2} />
              </div>
              <div>
                <div className={styles.cardTitle}>+28% Average Order Value</div>
                <div className={styles.cardSubtitle}>Intelligent course &amp; side upselling</div>
              </div>
            </div>
          </div>

          {/* Mobile Visual */}
          <div className={styles.mobileVisual}>
            <Image
              src="/images/landing_page_mobile.png"
              alt="mAInu mobile restaurant experience"
              width={750}
              height={1334}
              className={styles.heroImageMobile}
              priority
            />
            <div className={styles.mobileBadge}>
              <ScanLine size={13} style={{ marginRight: 6 }} />
              <span>Table QR Live • FSSAI Tagged</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
