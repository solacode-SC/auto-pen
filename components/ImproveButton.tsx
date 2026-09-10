'use client';

import { useEffect, useState } from 'react';
import styles from './ImproveButton.module.css';

interface ImproveButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function ImproveButton({ onClick, loading, disabled }: ImproveButtonProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <div className={styles.container}>
      <button 
        className={styles.button} 
        onClick={onClick} 
        disabled={disabled || loading}
      >
        {loading ? '✦ Polishing...' : '✦ Improve text'}
      </button>
      <div className={styles.hint}>
        {isMac ? '⌘' : 'Ctrl'} + Enter
      </div>
    </div>
  );
}
