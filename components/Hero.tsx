import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heading}>
        Write rough.
        <br />
        <span className={styles.highlightWrapper}>
          Send polished.
          <span className={styles.highlight} aria-hidden="true"></span>
        </span>
        <span className={styles.sparkleYellow} aria-hidden="true">✦</span>
        <span className={styles.sparklePink} aria-hidden="true">✦</span>
      </h1>
      <p className={styles.subheading}>Fix your words. Keep your voice.</p>
    </section>
  );
}
