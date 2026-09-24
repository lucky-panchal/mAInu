'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Hero({
  badgeText = "Autonomous Restaurant Operating System",
  prefixText = "Digital Dining that is",
  words,
  description = "Transform paper menus into high-speed digital ordering in 45 seconds. Drive faster table turns, higher ticket sizes, and real-time kitchen routing.",
  primaryCtaText = "Start Free Forever",
  primaryCtaLink = "/signup",
  secondaryCtaText = "Explore Kitchen Flow",
  secondaryCtaLink = "#how-it-works",
}) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () =>
      words && words.length > 0
        ? words
        : ["Fast & Seamless", "AI-Powered", "Revenue-Boosting", "Peak-Shift Ready", "Effortless"],
    [words]
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

  return (
    <div className="w-full" style={{ width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '40px 0 20px',
            textAlign: 'center',
          }}
        >
          {/* Badge */}
          {badgeText && (
            <div>
              <span
                className="tag tag-accent"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  background: 'var(--color-terracotta-light, rgba(200, 90, 50, 0.12))',
                  color: 'var(--color-terracotta, #C85A32)',
                  border: '1px solid rgba(200, 90, 50, 0.25)',
                }}
              >
                <Sparkles size={13} />
                {badgeText}
              </span>
            </div>
          )}

          {/* Heading with Animated Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <h1
              className="display-xl"
              style={{
                fontFamily: 'var(--font-heading, "Google Sans", sans-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
                color: 'var(--text-primary, #000000)',
                margin: 0,
              }}
            >
              <span style={{ display: 'block', marginBottom: '4px' }}>{prefixText}</span>
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  height: '1.3em',
                  color: 'var(--color-terracotta, #C85A32)',
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
                    }}
                    initial={{ opacity: 0, y: -60 }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -70 : 70, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body, "Manrope", sans-serif)',
                fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
                lineHeight: 1.6,
                color: 'var(--text-secondary, #5A5A5A)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              {description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            <Link href={primaryCtaLink} style={{ textDecoration: 'none' }}>
              <Button size="lg" className="btn btn-primary" style={{ gap: '8px' }}>
                {primaryCtaText} <ArrowRight className="w-4 h-4" size={16} />
              </Button>
            </Link>
            <a href={secondaryCtaLink} style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="outline" className="btn btn-outline" style={{ gap: '8px' }}>
                {secondaryCtaText}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
export default Hero;
