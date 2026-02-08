import React, { useState } from 'react';
import styles from './ReportModal.module.scss';
import { REPORT_REASONS, reportContent } from '../../services/report';

/**
 * 신고 모달
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'user'|'project'|'recruitment'} props.targetType
 * @param {string|number} props.targetId
 * @param {Function} [props.onSuccess] - 신고 성공 콜백
 */
export default function ReportModal({ isOpen, onClose, targetType, targetId, onSuccess }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [detail, setDetail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('신고 사유를 선택해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await reportContent(targetType, targetId, selectedReason, detail);
            onSuccess?.();
            handleClose();
        } catch (err) {
            if (err.code === 'ALREADY_REPORTED') {
                setError('이미 신고한 콘텐츠입니다.');
            } else {
                setError(err.message || '신고에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setDetail('');
        setError('');
        onClose();
    };

    return (
        <div className={styles.dim} role="dialog" aria-modal="true" onClick={handleClose}>
            <div className={styles.card} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>신고하기</h2>
                <p className={styles.desc}>신고 사유를 선택해주세요.</p>

                <ul className={styles.reasonList}>
                    {REPORT_REASONS.map((reason) => (
                        <li
                            key={reason.value}
                            className={`${styles.reasonItem} ${selectedReason === reason.value ? styles.selected : ''}`}
                            onClick={() => setSelectedReason(reason.value)}
                        >
                            <div className={styles.radio}>
                                {selectedReason === reason.value && <div className={styles.radioDot} />}
                            </div>
                            <span>{reason.label}</span>
                        </li>
                    ))}
                </ul>

                {selectedReason === 'other' && (
                    <textarea
                        className={styles.detailInput}
                        placeholder="상세 내용을 입력해주세요."
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        maxLength={500}
                        rows={3}
                    />
                )}

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                    <button className={styles.secondary} onClick={handleClose} disabled={isLoading}>
                        취소
                    </button>
                    <button className={styles.primary} onClick={handleSubmit} disabled={isLoading || !selectedReason}>
                        {isLoading ? '처리 중...' : '신고하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
