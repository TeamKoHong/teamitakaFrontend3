import React from 'react';
import styles from './CategorySlidersGroup.module.scss';
import CategorySlider from '../Common/CategorySlider';

export default function CategorySlidersGroup({
  items = [],
  values = {},
  onChange,
  hideDescription = false,
  readOnly = false
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className={styles.group} aria-label="카테고리 슬라이더">
      <div className={styles.unifiedCard}>
        {items.map((it, idx) => (
          <div key={it.key} className={styles.row}>
            <CategorySlider
              category={it.key}
              name={it.name}
              description={it.desc}
              value={values[it.key] ?? it.value ?? 1}
              onChange={(v) => !readOnly && onChange && onChange(it.key, v)}
              compact
              showDescription={!hideDescription}
              showThumb={!readOnly}
              disabled={readOnly}
            />
            {idx < items.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </section>
  );
}

