'use client';

import styles from './ResultPanel.module.css';

interface ResultPanelProps {
  result: string;
  loading: boolean;
  error: string;
  onCopy: () => void;
  copied: boolean;
  onImproveAgain: () => void;
}

export default function ResultPanel({
  result,
  loading,
  error,
  onCopy,
  copied,
  onImproveAgain
}: ResultPanelProps) {
  const charCount = result.length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot}></span>
          <span className={styles.label}>POLISHED VERSION</span>
        </div>
      </div>
      
      <div className={styles.body}>
        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.pulseSparkle}>✦</span> Working on it...
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <strong>Something went wrong.</strong>
            <div>Your text is still here. Try again.</div>
          </div>
        ) : result ? (
          <div className={styles.resultText}>
            {result}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptySparkle}>✦</div>
            <div className={styles.emptyTitle}>Your improved text will appear here.</div>
            <div className={styles.emptySubtitle}>Write something on the left and click Improve.</div>
            
            <div className={styles.exampleBox}>
              <div className={styles.exampleLabel}>Example</div>
              <div className={styles.exampleText}>
                Hey, I wanted to ask if you could send me the file when you have some time. Thanks!
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {result && !loading && !error && (
            <span>{charCount} character{charCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className={styles.actions}>
          {result && !loading && !error && (
            <>
              <button className={styles.improveButton} onClick={onImproveAgain}>
                Improve again
              </button>
              <button 
                className={`${styles.copyButton} ${copied ? styles.copied : ''}`} 
                onClick={onCopy}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
