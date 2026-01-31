import React, { useState } from 'react';
import Button from '../../../components/DesignSystem/Button/Button';
import { formatPhoneNumber, requestFindIdSms } from '../../../services/findAccount';
import styles from '../FindIdPage.module.scss';

// 통신사 옵션
const CARRIERS = [
    { value: '', label: '통신사' },
    { value: 'SKT', label: 'SKT' },
    { value: 'KT', label: 'KT' },
    { value: 'LGU', label: 'LG U+' },
    { value: 'BUDGET', label: '알뜰폰' }
];

/**
 * 아이디 찾기 Step 1 - 정보 입력
 */
function FindIdStep1({ formData, onComplete }) {
    const [name, setName] = useState(formData.name || '');
    const [carrier, setCarrier] = useState(formData.carrier || '');
    const [phone, setPhone] = useState(formData.phone || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 폼 유효성 검사
    const isFormValid = name.trim().length >= 2 && carrier && phone.length >= 13;

    // 휴대폰 번호 변경
    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    // 본인인증 버튼 클릭
    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            await requestFindIdSms({ name, carrier, phone });
            onComplete({ name, carrier, phone });
        } catch (err) {
            setError(err.message || '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.description}>
                <p>본인 확인을 위해</p>
                <p>아래 정보를 입력해주세요.</p>
                <p className={styles.subDescription}>티미타카에 가입했던 정보로 입력해주세요.</p>
            </div>

            {/* 이름 입력 */}
            <div className={styles.formSection}>
                <label className={styles.label}>이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    className={styles.input}
                />
            </div>

            {/* 휴대전화번호 */}
            <div className={styles.formSection}>
                <label className={styles.label}>휴대전화번호</label>
                <div className={styles.phoneRow}>
                    <select
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className={styles.carrierSelect}
                    >
                        {CARRIERS.map(c => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="휴대폰번호"
                        className={styles.phoneInput}
                        maxLength={13}
                    />
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isFormValid || isLoading}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                >
                    본인인증
                </Button>
            </div>
        </div>
    );
}

export default FindIdStep1;
