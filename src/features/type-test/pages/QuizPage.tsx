import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useLocation } from 'shared/shims/useNextRouterShim';
import QuestionCard from 'features/type-test/components/QuestionCard';
import { questions } from 'features/type-test/lib/questions';
import { calculateMBTIType, type Answer } from 'features/type-test/lib/scoring';
import { saveTypeResult } from 'services/user';
import 'features/type-test/styles/type-test-base.css';

export default function QuizPage() {
    const router = useRouter();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || '/';
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAnswer = async (answer: boolean) => {
        if (isProcessing) return;

        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;

        if (newAnswers.length > currentQuestion + 1) {
            newAnswers.splice(currentQuestion + 1);
        }

        setAnswers(newAnswers);

        if (currentQuestion + 1 === questions.length) {
            setIsProcessing(true);

            setTimeout(async () => {
                try {
                    let finalAnswers = newAnswers.slice(0, questions.length);
                    while (finalAnswers.length < questions.length) {
                        finalAnswers.push(false);
                    }

                    const mbtiType = calculateMBTIType(finalAnswers);

                    // Backend Integration: Save Result
                    try {
                        await saveTypeResult({
                            type: mbtiType,
                            answers: finalAnswers
                        });

                        // [Fallback] Save to local storage for immediate UI update
                        // because /api/auth/me might not return the new field immediately
                        localStorage.setItem('user_mbti_type', mbtiType);

                    } catch (apiError) {

                        // Even if server save fails, save locally so user sees result
                        localStorage.setItem('user_mbti_type', mbtiType);
                    }

                    router.push(`/type-test/complete?type=${encodeURIComponent(mbtiType)}`, { state: { from } });
                } catch (error) {

                    alert('결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
                    setIsProcessing(false);
                }
            }, 1500);
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = useCallback(() => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setAnswers(prev => prev.slice(0, currentQuestion - 1));
        } else {
            // 첫 질문에서 뒤로가기 → 인트로 페이지로 (from state 유지)
            router.push('/type-test', { state: { from } });
        }
    }, [currentQuestion, router, from]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleBack();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack]);

    // 브라우저 뒤로가기 시 이전 질문으로 이동
    useEffect(() => {
        // 최초 마운트 시에만 히스토리 상태 추가
        window.history.pushState({ quiz: true }, '', window.location.href);
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            // 뒤로가기 시 다시 pushState하여 페이지 이탈 방지
            window.history.pushState({ quiz: true }, '', window.location.href);
            handleBack();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [handleBack]);

    return (
        <div className="tw-min-h-screen" style={{
            fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
            backgroundColor: '#323030'
        }}>
            {isProcessing ? (
                <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                    <div className="tw-text-center">
                        <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-orange-500 tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mx-auto tw-mb-4"></div>
                        <p className="tw-text-white">결과 분석 중...</p>
                    </div>
                </div>
            ) : (
                <QuestionCard
                    question={questions[currentQuestion].text}
                    questionNumber={currentQuestion + 1}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswer}
                    onBack={handleBack}
                    key="quiz-card"
                />
            )}
        </div>
    );
}
