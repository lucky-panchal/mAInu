import styles from "./page.module.css";

const NAV_LINKS = ["Features", "How it works", "Pricing", "About"];

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Health Insights",
    desc: "Get real-time, breed-specific health recommendations powered by our fine-tuned veterinary model.",
  },
  {
    icon: "📍",
    title: "Activity Tracking",
    desc: "Monitor daily activity, sleep patterns, and exercise goals with smart wearable integration.",
  },
  {
    icon: "🍽️",
    title: "Nutrition Planning",
    desc: "Personalised meal plans and portion guidance based on your pet's age, weight, and health status.",
  },
  {
    icon: "💬",
    title: "24/7 AI Vet Chat",
    desc: "Instant answers to your pet-care questions — any time, any day, no appointment needed.",
  },
  {
    icon: "🔔",
    title: "Smart Reminders",
    desc: "Never miss a vaccination, grooming session, or medication dose with proactive notifications.",
  },
  {
    icon: "📊",
    title: "Wellness Dashboard",
    desc: "A beautiful, unified view of your pet's health history, trends, and upcoming care events.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ── Navbar ── */}
      <header className={styles.navbar}>
        <a href="/" className={styles.logo} id="logo-link">
          <span className={styles.logoDot}>m</span>AInu
        </a>
        <nav className={styles.navLinks} aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g, "-")}`} className={styles.navLink}>
              {link}
            </a>
          ))}
        </nav>
        <a href="#waitlist" className={styles.navCta} id="nav-cta-button">
          Join Waitlist
        </a>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero} id="hero">
          <div className={styles.heroBadge}>✨ Now in early access</div>
          <h1 className={styles.heroTitle}>
            Your pet's health,{" "}
            <span className={styles.heroGradient}>supercharged by AI</span>
          </h1>
          <p className={styles.heroSubtitle}>
            mAInu is the intelligent companion for modern pet owners — combining
            AI-driven insights, health tracking, and vet-grade recommendations
            in one beautiful app.
          </p>
          <div className={styles.heroCtas}>
            <a href="#waitlist" className={styles.btnPrimary} id="hero-waitlist-btn">
              Get Early Access
            </a>
            <a href="#features" className={styles.btnSecondary} id="hero-features-btn">
              See Features →
            </a>
          </div>
          {/* Decorative orbs */}
          <div className={styles.orb1} aria-hidden="true" />
          <div className={styles.orb2} aria-hidden="true" />
        </section>

        {/* ── Features ── */}
        <section className={styles.features} id="features">
          <div className={styles.sectionLabel}>Features</div>
          <h2 className={styles.sectionTitle}>
            Everything your pet needs, nothing you don't
          </h2>
          <p className={styles.sectionSubtitle}>
            Built around real vet knowledge and machine learning, mAInu adapts
            to your unique pet and lifestyle.
          </p>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <article key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Waitlist CTA ── */}
        <section className={styles.waitlist} id="waitlist">
          <div className={styles.waitlistGlow} aria-hidden="true" />
          <div className={styles.waitlistContent}>
            <div className={styles.sectionLabel}>Early Access</div>
            <h2 className={styles.waitlistTitle}>
              Be the first to experience mAInu
            </h2>
            <p className={styles.waitlistSubtitle}>
              Join thousands of pet parents already on the waitlist. No spam,
              just updates — and early access perks.
            </p>
            <form className={styles.waitlistForm} id="waitlist-form" onSubmit={(e) => e.preventDefault()}>
              <input
                id="waitlist-email"
                type="email"
                placeholder="Enter your email"
                className={styles.waitlistInput}
                required
                aria-label="Email address for waitlist"
              />
              <button type="submit" className={styles.btnPrimary} id="waitlist-submit-btn">
                Notify Me
              </button>
            </form>
            <p className={styles.waitlistNote}>
              🔒 We respect your privacy. Unsubscribe any time.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>
          <span className={styles.logoDot}>m</span>AInu
        </span>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} mAInu. Made with ❤️ for pets everywhere.
        </p>
      </footer>
    </div>
  );
}
