'use client';

import { useState } from 'react';
import styles from './InputPanel.module.css';

interface InputPanelProps {
  text: string;
  onChange: (text: string) => void;
  onClear: () => void;
}

export default function InputPanel({ text, onChange, onClear }: InputPanelProps) {
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className={`${styles.card} ${isFocused ? styles.focused : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot}></span>
          <span className={styles.label}>YOUR TEXT</span>
        </div>
        <div className={styles.headerRight}>
          Write it however it comes to you.
        </div>
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Write your text here..."
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Input text"
      />
      <div className={styles.footer}>
        <div className={styles.stats}>
          {wordCount} word{wordCount !== 1 ? 's' : ''} · {charCount} character{charCount !== 1 ? 's' : ''}
        </div>
        <button
          className={`${styles.clearButton} ${!text ? styles.hidden : ''}`}
          onClick={onClear}
          disabled={!text}
          aria-label="Clear text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
