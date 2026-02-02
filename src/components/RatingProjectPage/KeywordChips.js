import React from 'react';
import styles from './KeywordChips.module.scss';

export default function KeywordChips({ items = [], active, onSelect }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.chipsWrap} aria-label="키워드 칩">
      {items.map((kw) => (
        <span
          key={kw}
          role="button"
          tabIndex={0}
          className={`${styles.chip} ${active === kw ? styles.active : ''}`}
          onClick={() => onSelect && onSelect(kw)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect && onSelect(kw);
            }
          }}
        >
          #{kw}
        </span>
      ))}
    </div>
  );
}

