import React from 'react';
import styles from './AlertModal.module.scss';
import exclamationIcon from '../../assets/icons/exclamation.svg';

/**
 * 세션 만료 전용 모달 (버튼 없음, 자동 닫힘 가능)
 * - 기존 AlertModal 수정 없이 동일 스타일 시트 재사용
 */
export default function SessionExpiredModal({ isOpen, message, autoCloseMs = 2000, onClose }) {
  const [open, setOpen] = React.useState(isOpen);

  React.useEffect(() => setOpen(isOpen), [isOpen]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setOpen(false);
      onClose && onClose();
    }, autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;
  return (
    <div className={styles.dim} role="alert" aria-live="assertive" onClick={() => { setOpen(false); onClose && onClose(); }}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <img src={exclamationIcon} alt="" aria-hidden="true" className={styles.icon} />
          <h2 className={styles.title}>세션 만료</h2>
          <div className={styles.desc}>{message || '로그인이 만료되었습니다. 다시 로그인해주세요.'}</div>
        </div>
      </div>
    </div>
  );
}


