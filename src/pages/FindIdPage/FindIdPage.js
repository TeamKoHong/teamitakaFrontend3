import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import FindIdStep1 from './components/FindIdStep1';
import FindIdStep2 from './components/FindIdStep2';
import FindIdResult from './components/FindIdResult';
import styles from './FindIdPage.module.scss';

/**
 * 아이디 찾기 페이지
 * Step 1: 정보 입력 (이름, 통신사, 휴대폰번호)
 * Step 2: 인증번호 입력
 * Step 3: 결과 (이메일, 가입일)
 */
function FindIdPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // 폼 데이터 (step 간 공유)
    const [formData, setFormData] = useState({
        name: '',
        carrier: '',
        phone: ''
    });

    // 결과 데이터
    const [result, setResult] = useState({
        email: '',
        joinDate: ''
    });

    // Step 1 완료 -> Step 2로 이동
    const handleStep1Complete = (data) => {
        setFormData(data);
        setStep(2);
    };

    // Step 2 완료 -> 결과 페이지로 이동
    const handleStep2Complete = (resultData) => {
        setResult(resultData);
        setStep(3);
    };

    // 뒤로가기 처리
    const handleBack = () => {
        if (step === 1) {
            navigate('/login');
        } else if (step === 3) {
            // 결과 페이지에서는 처음으로
            setStep(1);
            setFormData({ name: '', carrier: '', phone: '' });
            setResult({ email: '', joinDate: '' });
        } else {
            setStep(step - 1);
        }
    };

    // 로그인 페이지로 이동
    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <DefaultHeader
                title="아이디 찾기"
                onBack={handleBack}
            />

            <div className={styles.content}>
                {step === 1 && (
                    <FindIdStep1
                        formData={formData}
                        onComplete={handleStep1Complete}
                    />
                )}

                {step === 2 && (
                    <FindIdStep2
                        formData={formData}
                        onComplete={handleStep2Complete}
                        onBack={handleBack}
                    />
                )}

                {step === 3 && (
                    <FindIdResult
                        email={result.email}
                        joinDate={result.joinDate}
                        onGoToLogin={handleGoToLogin}
                    />
                )}
            </div>
        </div>
    );
}

export default FindIdPage;
