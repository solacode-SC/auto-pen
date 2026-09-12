'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useSettings } from './SettingsProvider';

export default function Header() {
  const { settings, updateTheme } = useSettings();
  const [showAbout, setShowAbout] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleTheme = () => {
    updateTheme(settings.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.left} aria-label="Polish Home">
            <span className={styles.logoMark}>✦</span>
            <span className={styles.logoText}>Polish</span>
          </Link>

          <div className={styles.right}>
            <button
              className={styles.pill}
              onClick={() => setShowAbout(true)}
              aria-label="About Polish"
            >
              <span>About</span>
            </button>
            <button
              className={`${styles.pill} ${styles.themeToggle}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {settings.theme === 'dark' ? '☾' : '☼'}
            </button>
            <button
              className={styles.pill}
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard Shortcuts"
            >
              <span className={styles.pillTextFull}>Shortcuts</span>
              <span className={styles.pillTextShort} aria-hidden="true">⌨</span>
            </button>
            <Link
              href="/settings"
              className={`${styles.pill} ${styles.settingsPill}`}
              aria-label="Open Settings"
            >
              <span className={styles.pillTextFull}>Settings </span>
              <span>⚙</span>
            </Link>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className={styles.modalOverlay} onClick={() => setShowAbout(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>✦ About Polish</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowAbout(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p className={styles.modalBody}>
              <strong>Write rough. Send polished.</strong>
              <br /><br />
              Polish is a lightweight, focused writing assistant designed to fix grammar, improve phrasing, and sharpen clarity while preserving your voice and natural style.
              <br /><br />
              Powered by the DeepSeek API. No accounts, no database, no distractions.
            </p>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className={styles.modalOverlay} onClick={() => setShowShortcuts(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>✦ Keyboard Shortcuts</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowShortcuts(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.shortcutList}>
              <div className={styles.shortcutItem}>
                <span>Improve text</span>
                <kbd className={styles.kbd}>Ctrl / ⌘ + Enter</kbd>
              </div>
              <div className={styles.shortcutItem}>
                <span>Switch Theme</span>
                <kbd className={styles.kbd}>Click ☼ / ☾ in Header</kbd>
              </div>
              <div className={styles.shortcutItem}>
                <span>Settings</span>
                <kbd className={styles.kbd}>Settings ⚙</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
