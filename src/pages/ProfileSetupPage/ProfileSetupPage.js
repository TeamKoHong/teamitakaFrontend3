import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/DesignSystem/Button/Button';
import { getSchoolFromEmail } from '../../constants/schools';
import styles from './ProfileSetupPage.module.scss';

/**
 * 프로필 설정 페이지 (2단계)
 * Step 1: 닉네임 + 학과/전공
 * Step 2: 관심 분야 키워드
 */
function ProfileSetupPage() {
    const navigate = useNavigate();
    const { updateUser, user, registration } = useAuth();

    // 내부 스텝 관리 (1: 닉네임/학과, 2: 키워드)
    const [step, setStep] = useState(1);

    // Step 1 데이터
    const [nickname, setNickname] = useState('');
    const [mainMajor, setMainMajor] = useState('');
    const [subMajor, setSubMajor] = useState('');

    // Step 2 데이터
    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');

    // 학교 이메일에서 학교명 자동 감지
    const [detectedSchool, setDetectedSchool] = useState(null);

    useEffect(() => {
        if (registration?.schoolEmail) {
            const school = getSchoolFromEmail(registration.schoolEmail);
            setDetectedSchool(school);
        }
    }, [registration]);

    // 뒤로가기
    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate(-1);
        }
    };

    // 건너뛰기
    const handleSkip = () => {
        navigate('/register-complete');
    };

    // Step 1 -> Step 2
    const handleStep1Next = () => {
        setStep(2);
    };

    // 키워드 추가
    const handleAddKeyword = (e) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            const newKeyword = keywordInput.trim();
            // 중복 체크 및 최대 5개 제한
            if (!keywords.includes(newKeyword) && keywords.length < 5) {
                setKeywords([...keywords, newKeyword]);
            }
            setKeywordInput('');
        }
    };

    // 키워드 삭제
    const handleRemoveKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    // 완료 버튼 클릭
    const handleComplete = () => {
        // 사용자 정보 업데이트
        if (updateUser && user) {
            updateUser({
                ...user,
                nickname,
                school: detectedSchool,
                mainMajor: mainMajor || null,
                subMajor: subMajor || null,
                keywords
            });
        }

        // 회원가입 완료 페이지로 이동
        navigate('/register-complete');
    };

    // Step 1 유효성: 닉네임 필수
    const isStep1Valid = nickname.trim().length > 0;
    // Step 2 유효성: 키워드 1개 이상
    const isStep2Valid = keywords.length > 0;

    return (
        <div className={styles.container}>
            {/* 커스텀 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <svg width="7" height="15" viewBox="0 0 7 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L1 7.5L6 14" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className={styles.headerTitle}>프로필 정보 입력</h1>
                <button className={styles.skipLink} onClick={handleSkip}>
                    건너뛰기
                </button>
            </header>

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                {/* Progress Indicator */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressDot} />
                    <div className={styles.progressDot} />
                    <div className={styles.progressDot} />
                    <div className={styles.progressDot} />
                    <div className={step === 2 ? styles.progressBarActive : styles.progressBar} />
                </div>

                {step === 1 ? (
                    <>
                        {/* Step 1: 닉네임 + 학과 */}
                        <div className={styles.titleSection}>
                            <h2 className={styles.title}>
                                나를 소개할<br />
                                프로필 정보를 입력하세요
                            </h2>
                            <p className={styles.subtitle}>팀원들에게 보여질 프로필이에요.</p>
                        </div>

                        <div className={styles.formContainer}>
                            {/* 닉네임 */}
                            <div className={styles.formSection}>
                                <label className={styles.label}>닉네임</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="사용하실 닉네임을 입력해주세요."
                                    className={styles.input}
                                />
                            </div>

                            {/* 학과/전공 */}
                            <div className={styles.formSection}>
                                <label className={styles.label}>학과/전공</label>
                                <input
                                    type="text"
                                    value={mainMajor}
                                    onChange={(e) => setMainMajor(e.target.value)}
                                    placeholder="주전공을 입력하세요"
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    value={subMajor}
                                    onChange={(e) => setSubMajor(e.target.value)}
                                    placeholder="복수 전공을 입력하세요"
                                    className={styles.input}
                                />
                                <p className={styles.hint}>복수 전공은 선택 입력입니다.</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Step 2: 키워드 */}
                        <div className={styles.titleSection}>
                            <h2 className={styles.title}>
                                나를 표현하는<br />
                                키워드를 입력하세요
                            </h2>
                            <p className={styles.subtitle}>관심 분야와 강점을 1개 이상 적어주세요.</p>
                        </div>

                        <div className={styles.formContainer}>
                            <div className={styles.formSection}>
                                <label className={styles.label}>관심 분야를 입력하세요.</label>
                                <p className={styles.hint}>예: 마케팅, 영상 편집, 발표 잘함 등</p>

                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={handleAddKeyword}
                                    placeholder="키워드 입력 후 Enter"
                                    className={styles.input}
                                />

                                {/* 키워드 태그 목록 */}
                                {keywords.length > 0 && (
                                    <div className={styles.keywordList}>
                                        {keywords.map((keyword, index) => (
                                            <div
                                                key={index}
                                                className={styles.keywordTag}
                                                onClick={() => handleRemoveKeyword(keyword)}
                                            >
                                                <span className={styles.keywordHash}>#</span>
                                                <span>{keyword}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                {step === 1 ? (
                    <Button
                        fullWidth
                        disabled={!isStep1Valid}
                        onClick={handleStep1Next}
                    >
                        확인
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        disabled={!isStep2Valid}
                        onClick={handleComplete}
                    >
                        회원 가입 완료하기
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ProfileSetupPage;
