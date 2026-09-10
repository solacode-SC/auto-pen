import styles from './PrivacyNotice.module.css';

export default function PrivacyNotice() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>🔒 No account. No saved history.</div>
      <div className={styles.subtitle}>
        Your text is only sent for processing when you click Improve.
      </div>
    </div>
  );
}
