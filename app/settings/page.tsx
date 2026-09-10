'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './settings.module.css';
import { useSettings } from '@/components/SettingsProvider';
import { ACCENT_COLORS, DEFAULT_SETTINGS } from '@/lib/settings';

export default function SettingsPage() {
  const { settings, updateApiKey, updateTheme, updateAccent } = useSettings();
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveApiKey = () => {
    updateApiKey(apiKeyInput.trim());
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleClearApiKey = () => {
    setApiKeyInput('');
    updateApiKey('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setTestStatus('Please enter an API key to test.');
      return;
    }

    setIsTesting(true);
    setTestStatus(null);

    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': keyToTest,
        },
        body: JSON.stringify({
          text: 'hello world test connection',
          type: 'message',
          apiKey: keyToTest,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus('✓ API key is working properly!');
      } else {
        setTestStatus(`Connection error: ${data.error || 'Failed'}`);
      }
    } catch {
      setTestStatus('Connection failed. Check network or key validity.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetDefaults = () => {
    setApiKeyInput(DEFAULT_SETTINGS.apiKey);
    updateApiKey(DEFAULT_SETTINGS.apiKey);
    updateTheme(DEFAULT_SETTINGS.theme);
    updateAccent(DEFAULT_SETTINGS.accent);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink} aria-label="Return to Editor">
          ← Back to Polish
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>⚙</span> Settings
        </h1>
        <p className={styles.subtitle}>
          Customize your writing workspace, API connection, and personal appearance.
        </p>
      </header>

      <div className={styles.sections}>
        {/* Section 1: DeepSeek API Key */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🔑</span>
            <h2 className={styles.cardTitle}>DeepSeek API Key</h2>
          </div>
          <p className={styles.cardDesc}>
            Use your own DeepSeek API key for text improvement. Your key is kept only in your browser&apos;s local storage and is sent directly with your requests.
          </p>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showKey ? 'text' : 'password'}
                className={styles.apiKeyInput}
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                aria-label="DeepSeek API Key"
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              className={styles.actionButton}
              onClick={handleSaveApiKey}
            >
              {savedFeedback ? '✓ Saved' : 'Save Key'}
            </button>
          </div>

          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryButton}
              onClick={handleTestKey}
              disabled={isTesting || !apiKeyInput.trim()}
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              className={styles.secondaryButton}
              onClick={handleClearApiKey}
              disabled={!apiKeyInput && !settings.apiKey}
            >
              Clear Key
            </button>
          </div>

          {testStatus && (
            <div
              className={`${styles.statusNotice} ${
                testStatus.startsWith('✓') ? styles.statusConfigured : styles.statusNotConfigured
              }`}
            >
              {testStatus}
            </div>
          )}

          <div>
            {settings.apiKey ? (
              <span className={`${styles.statusNotice} ${styles.statusConfigured}`}>
                ✓ Using Custom Browser API Key
              </span>
            ) : (
              <span className={`${styles.statusNotice} ${styles.statusNotConfigured}`}>
                ℹ Using Server Environment Default (if configured)
              </span>
            )}
          </div>
        </section>

        {/* Section 2: Appearance Mode */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>☼</span>
            <h2 className={styles.cardTitle}>Theme Mode</h2>
          </div>
          <p className={styles.cardDesc}>
            Select your preferred interface brightness mode.
          </p>

          <div className={styles.modeGrid}>
            <button
              className={`${styles.modeCard} ${
                settings.theme === 'light' ? styles.modeCardActive : ''
              }`}
              onClick={() => updateTheme('light')}
            >
              <span className={styles.modeIcon}>☼</span>
              <span>Light Mode</span>
            </button>
            <button
              className={`${styles.modeCard} ${
                settings.theme === 'dark' ? styles.modeCardActive : ''
              }`}
              onClick={() => updateTheme('dark')}
            >
              <span className={styles.modeIcon}>☾</span>
              <span>Dark Mode</span>
            </button>
          </div>
        </section>

        {/* Section 3: Accent Color */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🎨</span>
            <h2 className={styles.cardTitle}>Accent Color</h2>
          </div>
          <p className={styles.cardDesc}>
            Choose an accent color for main buttons, highlights, and primary actions.
          </p>

          <div className={styles.accentGrid}>
            {ACCENT_COLORS.map((accent) => (
              <button
                key={accent.value}
                className={`${styles.accentCard} ${
                  settings.accent === accent.value ? styles.accentCardActive : ''
                }`}
                onClick={() => updateAccent(accent.value)}
              >
                <span
                  className={styles.accentSwatch}
                  style={{ backgroundColor: accent.color }}
                />
                <span>{accent.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.previewBox}>
            <span className={styles.previewLabel}>Live Preview</span>
            <button className={styles.previewButton} type="button">
              ✦ Improve text
            </button>
          </div>
        </section>

        {/* Section 4: Reset */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>↺</span>
            <h2 className={styles.cardTitle}>Reset Preferences</h2>
          </div>
          <p className={styles.cardDesc}>
            Restore all settings to original factory defaults.
          </p>
          <button
            className={styles.secondaryButton}
            onClick={handleResetDefaults}
          >
            Reset to Defaults
          </button>
        </section>
      </div>
    </div>
  );
}
