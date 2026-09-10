import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.title}>Polish · Write rough. Send polished.</div>
      <div className={styles.subtitle}>Built for better everyday writing.</div>
      <div className={styles.sparkle}>✦</div>
    </footer>
  );
}
