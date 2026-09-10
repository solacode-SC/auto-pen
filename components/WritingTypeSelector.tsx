'use client';

import styles from './WritingTypeSelector.module.css';
import { WRITING_TYPES, WritingType } from '@/lib/types';

interface WritingTypeSelectorProps {
  selected: WritingType;
  onSelect: (type: WritingType) => void;
}

export default function WritingTypeSelector({ selected, onSelect }: WritingTypeSelectorProps) {
  const selectedTypeObj = WRITING_TYPES.find(t => t.value === selected);

  return (
    <div className={styles.section}>
      <h2 className={styles.label}>What are you writing?</h2>
      <div className={styles.pillContainer}>
        {WRITING_TYPES.map((type) => {
          const isSelected = type.value === selected;
          return (
            <button
              key={type.value}
              className={`${styles.pill} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(type.value)}
              aria-pressed={isSelected}
            >
              {type.label}
            </button>
          );
        })}
      </div>
      {selectedTypeObj && (
        <p className={styles.hint}>{selectedTypeObj.hint}</p>
      )}
    </div>
  );
}
