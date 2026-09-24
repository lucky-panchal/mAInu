'use client';
import { useState, useEffect, useRef } from 'react';
import { ScanLine, Palette, QrCode, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import styles from './HowItWorksSection.module.css';

const TABS = [
  {
    id: 'scan',
    label: '01. Vision OCR Scan',
    icon: <ScanLine size={16} />,
    title: 'Scan any paper menu.\nGo live in under 60 seconds.',
    description:
      'Upload a smartphone photo, PDF, or blackboard menu. mAInu’s computer-vision parser detects item titles, multi-portion pricing, dietary tags, and descriptions automatically.',
    points: [
      'Extracts 60+ dishes in a single capture',
      'Detects FSSAI Veg, Non-Veg, & Jain dietary flags',
      'Automatic course grouping (Starters, Mains, Breads, Beverages)',
    ],
  },
  {
    id: 'customize',
    label: '02. Theme Engine',
    icon: <Palette size={16} />,
    title: 'Brand it to match\nyour restaurant ambiance.',
    description:
      'Tailor typography, color palettes, and photography layouts. Whether a high-end bistro or a buzzing brewery, your digital menu feels custom-crafted.',
    points: [
      'Architectural sharp Bauhaus themes with zero generic AI clutter',
      'Upload dish photos or auto-generate studio lighting',
      'Real-time badge controls (Chef Special, Must Try, 86’d Out)',
    ],
  },
  {
    id: 'launch',
    label: '03. Table QR Cards',
    icon: <QrCode size={16} />,
    title: 'Print durable table tents.\nGuests order seamlessly.',
    description:
      'Export ready-to-print vector table tent cards with encrypted table tokens. Diners scan with any phone camera to browse and order directly to the kitchen.',
    points: [
      'Zero app download required for diners',
      'Instant table routing directly to the KDS',
      'Encrypted tokens prevent off-premise ordering',
    ],
  },
  {
    id: 'grow',
    label: '04. Yield Analytics',
    icon: <TrendingUp size={16} />,
    title: 'Real-time kitchen flow\nand margin optimization.',
    description:
      'Identify slow-prep dishes causing kitchen bottlenecks, optimize high-margin beverage upselling, and monitor live RevPASH across lunch and dinner shifts.',
    points: [
      'Item-level profit margin yield reporting',
      'Kitchen station prep time escalation',
      'Automatic upselling boosts average ticket size by +28%',
    ],
  },
];

const THEME_PREVIEWS = [
  { name: 'Terracotta', bg: '#FAF7F0', cardBg: '#FFFFFF', accent: '#C85A32', text: '#141414' },
  { name: 'Midnight', bg: '#141414', cardBg: '#1E1E1E', accent: '#E5734A', text: '#FFFFFF' },
  { name: 'Olive Sage', bg: '#F2F5F0', cardBg: '#FFFFFF', accent: '#276749', text: '#141414' },
];

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);
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

  const tab = TABS[activeTab];

  return (
    <section className={`section ${styles.section}`} id="how-it-works" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} anim-item`}>
          <span className="tag tag-accent">Operational Architecture</span>
          <h2 className={`display-lg ${styles.heading}`}>
            One unified OS.<br />Every dining workflow mastered.
          </h2>
          <p className={styles.subheading}>
            Replace fragmented QR plugins, unreadable thermal slips, and clunky legacy POS hardware
            with an integrated restaurant engine.
          </p>
        </div>

        {/* Tab Nav */}
        <div className={`${styles.tabNav} anim-item`}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${i === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(i)}
              type="button"
            >
              <span className={styles.tabIcon}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`${styles.content} anim-item`} key={activeTab}>
          {/* Left Text */}
          <div className={styles.textSide}>
            <h3 className={`display-md ${styles.tabTitle}`}>
              {tab.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < tab.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className={styles.tabDesc}>{tab.description}</p>
            <ul className={styles.points}>
              {tab.points.map((p) => (
                <li key={p} className={styles.point}>
                  <span className={styles.pointDot} />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Test In Sandbox →
            </Link>
          </div>

          {/* Right Visual Micro-Preview */}
          <div className={styles.visualSide}>
            {activeTab === 0 && (
              /* Tab 0: OCR Scanner Micro-Preview */
              <div className={styles.previewBox}>
                <div className={styles.previewTopBar}>
                  <div className={styles.terminalDot} />
                  <span className={styles.previewTitle}>VISION OCR ENGINE v2.4 — LIVE PARSE</span>
                  <span className={styles.ocrStatus}>DETECTED: 100% CONFIDENCE</span>
                </div>
                <div className={styles.ocrScanView}>
                  <div className={styles.scanLaser} />
                  <div className={styles.ocrDishRow}>
                    <div className={styles.ocrBox}>
                      <span className={styles.ocrDishName}>Paneer Tikka Charcoal Grilled</span>
                      <span className={styles.ocrBadgeVeg}>VEG</span>
                    </div>
                    <span className={styles.ocrPrice}>₹240</span>
                  </div>

                  <div className={`${styles.ocrDishRow} ${styles.ocrHighlight}`}>
                    <div className={styles.ocrBox}>
                      <span className={styles.ocrDishName}>Old Delhi Butter Chicken (Half/Full)</span>
                      <span className={styles.ocrBadgeNonVeg}>NON-VEG</span>
                    </div>
                    <span className={styles.ocrPrice}>₹320 / ₹580</span>
                  </div>

                  <div className={styles.ocrDishRow}>
                    <div className={styles.ocrBox}>
                      <span className={styles.ocrDishName}>Dal Makhani Slow Cooked 24hrs</span>
                      <span className={styles.ocrBadgeVeg}>VEG</span>
                    </div>
                    <span className={styles.ocrPrice}>₹220</span>
                  </div>

                  <div className={styles.ocrDishRow}>
                    <div className={styles.ocrBox}>
                      <span className={styles.ocrDishName}>Butter Garlic Naan (Clay Oven)</span>
                      <span className={styles.ocrBadgeVeg}>VEG</span>
                    </div>
                    <span className={styles.ocrPrice}>₹65</span>
                  </div>
                </div>

                <div className={styles.ocrFooter}>
                  <span>4 dishes recognized in 1.4s</span>
                  <span className={styles.ocrSuccessBadge}>✓ Ready to Push to Menu</span>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              /* Tab 1: Theme Engine Micro-Preview */
              <div className={styles.previewBox}>
                <div className={styles.previewTopBar}>
                  <div className={styles.terminalDot} />
                  <span className={styles.previewTitle}>MENU BRANDING SYSTEM</span>
                  <div className={styles.paletteSelector}>
                    {THEME_PREVIEWS.map((th, idx) => (
                      <button
                        key={th.name}
                        type="button"
                        className={`${styles.colorChip} ${selectedTheme === idx ? styles.colorChipActive : ''}`}
                        style={{ background: th.accent }}
                        onClick={() => setSelectedTheme(idx)}
                        title={th.name}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className={styles.themeDisplay}
                  style={{
                    background: THEME_PREVIEWS[selectedTheme].bg,
                    color: THEME_PREVIEWS[selectedTheme].text,
                  }}
                >
                  <div className={styles.themeRestaurantHeader}>
                    <span className={styles.themeRestName}>SPICE ROUTE BISTRO</span>
                    <span className={styles.themeTableTag}>TABLE 07</span>
                  </div>

                  <div
                    className={styles.themeCardItem}
                    style={{
                      background: THEME_PREVIEWS[selectedTheme].cardBg,
                      borderColor: THEME_PREVIEWS[selectedTheme].accent,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>Truffle Butter Garlic Naan</span>
                      <span style={{ fontWeight: 700, color: THEME_PREVIEWS[selectedTheme].accent, fontFamily: 'monospace' }}>
                        ₹95
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.7, margin: '4px 0 8px' }}>
                      Hand-stretched leavened flatbread brushed with black truffle butter.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={styles.themeBadgeSpecial} style={{ background: THEME_PREVIEWS[selectedTheme].accent, color: '#fff' }}>
                        Chef Special
                      </span>
                      <span style={{ fontSize: '11px', opacity: 0.6, fontFamily: 'monospace' }}>★ 4.9 (124 ratings)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.ocrFooter}>
                  <span>Preset: {THEME_PREVIEWS[selectedTheme].name}</span>
                  <span className={styles.ocrSuccessBadge}>Real-time CSS variables synced</span>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              /* Tab 2: Table QR Generator Preview */
              <div className={styles.previewBox}>
                <div className={styles.previewTopBar}>
                  <div className={styles.terminalDot} />
                  <span className={styles.previewTitle}>TABLE TENT CARD EXPORTER (300 DPI)</span>
                  <span className={styles.ocrSuccessBadge}>PDF READY</span>
                </div>

                <div className={styles.tentCardPreview}>
                  <div className={styles.tentCardBorder}>
                    <div className={styles.tentCardHeader}>
                      <span className={styles.tentBrand}>mAInu Dine-In</span>
                      <span className={styles.tentTableNum}>TABLE 04</span>
                    </div>

                    <div className={styles.tentQrCenter}>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://mainu.app/menu/spice-route?table=Table%204&bgcolor=ffffff&color=141414&margin=1"
                        alt="QR Tent Card Preview"
                        width={130}
                        height={130}
                        style={{ display: 'block' }}
                      />
                    </div>

                    <div className={styles.tentCardFooter}>
                      <p className={styles.tentInstruction}>Point Phone Camera To Scan &amp; Order</p>
                      <span className={styles.tentMeta}>No app required • Instant kitchen routing</span>
                    </div>
                  </div>
                </div>

                <div className={styles.ocrFooter}>
                  <span>Print format: A6 tent card / acrylic base</span>
                  <span className={styles.ocrSuccessBadge}>Dynamic Table Session</span>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              /* Tab 3: Yield Analytics Preview */
              <div className={styles.previewBox}>
                <div className={styles.previewTopBar}>
                  <div className={styles.terminalDot} />
                  <span className={styles.previewTitle}>REVPASH &amp; KITCHEN VELOCITY REPORT</span>
                  <span className={styles.ocrStatus}>LIVE SHIFT DATA</span>
                </div>

                <div className={styles.analyticsDisplay}>
                  <div className={styles.kpiRowMini}>
                    <div className={styles.kpiMini}>
                      <span className={styles.kpiMiniLabel}>Avg Prep Time</span>
                      <span className={styles.kpiMiniValue}>11.4 min</span>
                      <span className={styles.kpiMiniDelta}>↓ 3.2m vs baseline</span>
                    </div>
                    <div className={styles.kpiMini}>
                      <span className={styles.kpiMiniLabel}>Table Turnover</span>
                      <span className={styles.kpiMiniValue}>38 min</span>
                      <span className={styles.kpiMiniDelta}>↑ 24% faster turns</span>
                    </div>
                  </div>

                  <div className={styles.marginLeaderboard}>
                    <div className={styles.leaderboardTitle}>TOP MARGIN PERFORMERS TODAY</div>
                    <div className={styles.leaderItem}>
                      <span>1. Butter Chicken (Full)</span>
                      <span className={styles.marginPercent}>68% margin</span>
                      <span className={styles.marginRevenue}>₹26,880</span>
                    </div>
                    <div className={styles.leaderItem}>
                      <span>2. Dal Makhani</span>
                      <span className={styles.marginPercent}>74% margin</span>
                      <span className={styles.marginRevenue}>₹15,840</span>
                    </div>
                    <div className={styles.leaderItem}>
                      <span>3. Garlic Naan</span>
                      <span className={styles.marginPercent}>82% margin</span>
                      <span className={styles.marginRevenue}>₹11,200</span>
                    </div>
                  </div>
                </div>

                <div className={styles.ocrFooter}>
                  <span>Shift: Dinner Rush (19:00 - 22:30)</span>
                  <span className={styles.ocrSuccessBadge}>F&amp;B P&amp;L Synchronized</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
