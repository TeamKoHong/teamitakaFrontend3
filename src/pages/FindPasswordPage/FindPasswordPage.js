import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import FindPwStep1 from './components/FindPwStep1';
import FindPwStep2 from './components/FindPwStep2';
import FindPwStep3 from './components/FindPwStep3';
import styles from './FindPasswordPage.module.scss';

/**
 * 비밀번호 찾기 페이지
 * Step 1: 이메일 입력
 * Step 2: 인증번호 입력
 * Step 3: 새 비밀번호 입력
 */
function FindPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    // Step 1 완료 -> Step 2로 이동
    const handleStep1Complete = (emailValue) => {
        setEmail(emailValue);
        setStep(2);
    };

    // Step 2 완료 -> Step 3로 이동
    const handleStep2Complete = () => {
        setStep(3);
    };

    // Step 3 완료 -> 로그인 페이지로 이동
    const handleStep3Complete = () => {
        navigate('/login');
    };

    // 뒤로가기 처리
    const handleBack = () => {
        if (step === 1) {
            navigate('/login');
        } else {
            setStep(step - 1);
        }
    };

    return (
        <div className={styles.container}>
            <DefaultHeader
                title="비밀번호 찾기"
                onBack={handleBack}
            />

            <div className={styles.content}>
                {step === 1 && (
                    <FindPwStep1
                        email={email}
                        onComplete={handleStep1Complete}
                    />
                )}

                {step === 2 && (
                    <FindPwStep2
                        email={email}
                        onComplete={handleStep2Complete}
                    />
                )}

                {step === 3 && (
                    <FindPwStep3
                        email={email}
                        onComplete={handleStep3Complete}
                    />
                )}
            </div>
        </div>
    );
}

export default FindPasswordPage;
