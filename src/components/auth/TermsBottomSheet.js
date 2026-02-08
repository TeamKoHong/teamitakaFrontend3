import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '../Common/BottomSheet';
import Button from '../DesignSystem/Button/Button';
import { TERMS_LIST } from '../../types/auth';
import styles from './TermsBottomSheet.module.scss';

/**
 * 본인인증 약관동의 바텀시트
 * @param {Object} props
 * @param {boolean} props.isOpen - 바텀시트 표시 여부
 * @param {Function} props.onClose - 닫기 콜백
 * @param {Function} props.onAgree - 동의 완료 콜백
 */
const TermsBottomSheet = ({ isOpen, onClose, onAgree }) => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});

    // 필수 항목만 필터링
    const requiredTerms = TERMS_LIST.filter(t => t.required);
    const isAllRequiredChecked = requiredTerms.every(t => checkedItems[t.id]);

    // 전체 동의 토글
    const handleAllCheck = () => {
        const newState = {};
        const shouldCheck = !isAllRequiredChecked;
        TERMS_LIST.forEach(t => {
            newState[t.id] = shouldCheck;
        });
        setCheckedItems(newState);
    };

    // 개별 항목 토글
    const toggleCheck = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // 동의 버튼 클릭
    const handleAgree = () => {
        if (isAllRequiredChecked) {
            onAgree();
        }
    };

    // 체크박스 아이콘
    const CheckIcon = ({ checked }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
            <path
                d="M14.4393 1.27284C15.025 0.68705 15.9746 0.68705 16.5604 1.27284C17.1461 1.85862 17.1461 2.80814 16.5604 3.39393L7.22734 12.7269C6.64156 13.3127 5.69204 13.3127 5.10625 12.7269L0.439258 8.06092C-0.146474 7.47519 -0.146365 6.52563 0.439258 5.93983C1.02504 5.35404 1.97457 5.35404 2.56035 5.93983L6.16582 9.5453L14.4393 1.27284Z"
                fill={checked ? "#F76241" : "#807C7C"}
            />
        </svg>
    );

    // 화살표 아이콘
    const ChevronIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M2 12.5L6.38848 7.67267C6.73523 7.29125 6.73523 6.70875 6.38848 6.32733L2 1.5" stroke="#807C7C" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    return (
        <BottomSheet
            open={isOpen}
            onDismiss={onClose}
            snapPoints={({ maxHeight }) => [maxHeight * 0.7]}
        >
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>본인인증 약관 동의</h3>
                </div>

                <div
                    className={`${styles.allCheck} ${isAllRequiredChecked ? styles.checked : ''}`}
                    onClick={handleAllCheck}
                >
                    <div className={styles.checkbox}>
                        <CheckIcon checked={isAllRequiredChecked} />
                    </div>
                    <span className={styles.allCheckText}>약관에 모두 동의</span>
                </div>

                <ul className={styles.termsList}>
                    {TERMS_LIST.map(term => (
                        <li
                            key={term.id}
                            className={styles.termsItem}
                        >
                            <div
                                className={styles.termsContent}
                                onClick={() => toggleCheck(term.id)}
                            >
                                <div className={styles.checkbox}>
                                    <CheckIcon checked={!!checkedItems[term.id]} />
                                </div>
                                <span className={styles.termsLabel}>
                                    <span className={styles.required}>[필수]</span> {term.label}
                                </span>
                            </div>
                            <button
                                className={styles.viewButton}
                                onClick={() => term.url && window.open(term.url, '_blank')}
                            >
                                <ChevronIcon />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className={styles.buttonWrapper}>
                    <Button
                        fullWidth
                        disabled={!isAllRequiredChecked}
                        onClick={handleAgree}
                    >
                        동의
                    </Button>
                </div>
            </div>
        </BottomSheet>
    );
};

export default TermsBottomSheet;
