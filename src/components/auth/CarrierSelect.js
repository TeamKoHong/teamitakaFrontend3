import React, { useState, useRef, useEffect } from 'react';
import { CARRIER_OPTIONS } from '../../types/auth';
import styles from './CarrierSelect.module.scss';

/**
 * 통신사 선택 드롭다운
 * @param {Object} props
 * @param {string} props.value - 선택된 통신사 코드
 * @param {Function} props.onChange - 선택 변경 콜백
 * @param {string} props.error - 에러 메시지
 */
const CarrierSelect = ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = CARRIER_OPTIONS.find(o => o.value === value);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                className={`${styles.select} ${error ? styles.error : ''} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? styles.value : styles.placeholder}>
                    {selectedOption?.label || '통신사'}
                </span>
                <svg
                    className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                >
                    <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="#807C7C"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {isOpen && (
                <ul className={styles.dropdown}>
                    {CARRIER_OPTIONS.map(option => (
                        <li
                            key={option.value}
                            className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default CarrierSelect;
