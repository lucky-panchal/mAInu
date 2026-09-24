import styles from './Footer.module.css';

const LINKS = {
  Product: ['Features', 'Pricing', 'How It Works', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Status', 'API Docs'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>mAInu</div>
            <p className={styles.tagline}>
              The AI-powered operating system for modern restaurants. Scan, digitize,
              and scale — from a single outlet to a chain.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">𝕏</a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">IG</a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn">in</a>
              <a href="#" className={styles.socialIcon} aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className={styles.linkGroup}>
              <div className={styles.groupTitle}>{group}</div>
              <ul className={styles.links}>
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className={styles.link}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} mAInu. All rights reserved.</span>
          <span className={styles.madeIn}>Made with ❤️ in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
