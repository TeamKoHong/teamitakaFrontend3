import React from 'react';
import styles from './SSNInput.module.scss';

/**
 * 주민등록번호 입력 컴포넌트 (생년월일 6자리 + 성별코드 1자리)
 * @param {Object} props
 * @param {string} props.birthDate - 생년월일 6자리 (YYMMDD)
 * @param {string} props.genderCode - 성별코드 1자리 (1-4)
 * @param {Function} props.onBirthDateChange - 생년월일 변경 콜백
 * @param {Function} props.onGenderCodeChange - 성별코드 변경 콜백
 * @param {string} props.error - 에러 메시지
 */
const SSNInput = ({
    birthDate,
    genderCode,
    onBirthDateChange,
    onGenderCodeChange,
    error
}) => {
    // 생년월일: 숫자만, 최대 6자리
    const handleBirthDateChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        onBirthDateChange(value);
    };

    // 성별코드: 1-4만 허용
    const handleGenderChange = (e) => {
        const value = e.target.value.replace(/[^1-4]/g, '').slice(0, 1);
        onGenderCodeChange(value);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
                <input
                    type="tel"
                    inputMode="numeric"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    placeholder="생년월일"
                    className={styles.birthInput}
                    maxLength={6}
                />
                <span className={styles.separator}>-</span>
                <input
                    type="tel"
                    inputMode="numeric"
                    value={genderCode}
                    onChange={handleGenderChange}
                    placeholder="0"
                    className={styles.genderInput}
                    maxLength={1}
                />
                <span className={styles.mask}>●●●●●●</span>
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default SSNInput;
