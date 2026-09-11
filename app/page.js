import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      {/* Desktop/laptop only (≥768px) */}
      <div className={styles.desktopOnly}>
        <Image
          src="/images/landing_page_web.png"
          alt="Landing page web"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Mobile only (<768px) */}
      <div className={styles.mobileOnly}>
        <Image
          src="/images/landing_page_mobile.png"
          alt="Landing page mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </main>
  );
}
