import React from 'react';
import styles from './AlertModal.module.scss';
import exclamationIcon from '../../assets/icons/exclamation.svg';

export default function AlertModal({
  isOpen,
  title,
  description,
  primaryLabel = '확인',
  secondaryLabel = '취소',
  onPrimary,
  onSecondary,
  onClose,
  icon = exclamationIcon,
}) {
  if (!isOpen) return null;
  return (
    <div className={styles.dim} role="dialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc" onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {icon && (
            <img src={icon} alt="" aria-hidden="true" className={styles.icon} />
          )}
          {title && <h2 id="alert-title" className={styles.title}>{title}</h2>}
          {description && (
            <div id="alert-desc" className={styles.desc}>{description}</div>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onSecondary}>{secondaryLabel}</button>
          <button className={styles.primary} onClick={onPrimary}>{primaryLabel}</button>
        </div>
      </div>
    </div>
  );
}


