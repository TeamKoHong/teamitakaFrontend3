import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import StepIndicator from '../../components/DesignSystem/Feedback/StepIndicator';
import CarrierSelect from '../../components/auth/CarrierSelect';
import SSNInput from '../../components/auth/SSNInput';
import TermsBottomSheet from '../../components/auth/TermsBottomSheet';
import Button from '../../components/DesignSystem/Button/Button';
import styles from './PhoneVerifyPage.module.scss';
import { useSmsAuth } from '../../hooks/useSmsAuth';

/**
 * 휴대폰 본인인증 - 정보 입력 페이지 (Step 1)
 */
function PhoneVerifyPage() {
    const navigate = useNavigate();

    // SMS Auth Hook
    const {
        phone,
        isLoading: isSmsLoading,
        error: smsError,
        errorSubMessage: smsErrorSubMessage,
        handlePhoneChange,
        sendSms,
    } = useSmsAuth();

    // Form States
    const [carrier, setCarrier] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [genderCode, setGenderCode] = useState('');
    const [name, setName] = useState('');

    // UI States
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    // Form Validation
    const isBasicFormValid = carrier && phone.length >= 12 && birthDate.length === 6 &&
        genderCode.length === 1 && name.trim().length >= 2;

    // Handle Back
    const handleBack = () => {
        navigate(-1);
    };

    // Open Terms Sheet
    const handleMainButtonClick = () => {
        if (isBasicFormValid) {
            setIsTermsOpen(true);
        }
    };

    // Terms Agreement -> Send SMS -> Navigate to Code Page
    const handleTermsAgree = async () => {
        setIsTermsOpen(false);
        try {
            const sessionId = await sendSms();
            if (sessionId) {
                navigate('/phone-verify/code', {
                    state: {
                        formData: { name, phone, birthDate, genderCode, carrier },
                        sessionId,
                        timerStart: Date.now(),
                    },
                });
            }
        } catch (err) {
            // Error is handled by useSmsAuth
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <DefaultHeader title="본인 인증" onBack={handleBack} />

            {/* Main Content */}
            <div className={styles.content}>
                <StepIndicator currentStep={1} totalSteps={5} />

                <div className={styles.description}>
                    <p>본인 확인을 위해</p>
                    <p>전화번호를 입력해주세요.</p>
                </div>

                {/* Phone Number Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>휴대전화번호</label>
                    <div className={styles.phoneRow}>
                        <div className={styles.carrierWrapper}>
                            <CarrierSelect
                                value={carrier}
                                onChange={setCarrier}
                            />
                        </div>
                        <div className={styles.phoneWrapper}>
                            <input
                                type="tel"
                                inputMode="numeric"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-0000-0000"
                                className={styles.phoneInput}
                                maxLength={13}
                            />
                        </div>
                    </div>
                </div>

                {/* SSN Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>주민등록번호</label>
                    <SSNInput
                        birthDate={birthDate}
                        genderCode={genderCode}
                        onBirthDateChange={setBirthDate}
                        onGenderCodeChange={setGenderCode}
                    />
                </div>

                {/* Name Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력해주세요"
                        className={styles.nameInput}
                    />
                </div>

                {/* Error Message */}
                {smsError && (
                    <div className={styles.errorMessage}>
                        {smsError}
                        {smsErrorSubMessage && (
                            <div className={styles.errorSubMessage}>{smsErrorSubMessage}</div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isBasicFormValid || isSmsLoading}
                    onClick={handleMainButtonClick}
                    isLoading={isSmsLoading}
                >
                    본인인증
                </Button>
            </div>

            {/* Terms Sheet */}
            <TermsBottomSheet
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                onAgree={handleTermsAgree}
            />
        </div>
    );
}

export default PhoneVerifyPage;
