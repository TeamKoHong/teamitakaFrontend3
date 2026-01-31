import React, { useState, useEffect, useCallback } from 'react';
import { useBrowserOptimization } from 'features/type-test/lib/hooks/useBrowserOptimization';
import { useSafariViewport } from 'features/type-test/lib/hooks/useSafariViewport';
import BackArrow from 'components/Common/UI/BackArrow';

interface QuestionCardProps {
    question: string;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answer: boolean) => void;
    onBack?: () => void;
    isLoading?: boolean;
    className?: string;
}

export default function QuestionCard({
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
    onBack,
    isLoading = false,
    className = ''
}: QuestionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
    useBrowserOptimization();
    const { isSafari } = useSafariViewport();

    useEffect(() => {
        setSelectedAnswer(null);
    }, [question]);

    const handleAnswerSelect = useCallback((answer: boolean) => {
        if (isLoading) return;
        setSelectedAnswer(answer);
        setTimeout(() => {
            onAnswer(answer);
        }, 150);
    }, [isLoading, onAnswer]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isLoading) return;

            switch (event.key) {
                case 'ArrowLeft':
                case '1':
                    event.preventDefault();
                    handleAnswerSelect(true);
                    break;
                case 'ArrowRight':
                case '2':
                    event.preventDefault();
                    handleAnswerSelect(false);
                    break;
                case 'Enter':
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLoading, handleAnswerSelect]);

    const responsiveQuestionStyle = {
        letterSpacing: '-0.03em',
        lineHeight: '1.5',
        fontSize: 'clamp(16px, calc(20px * (100vw / 390px)), 24px)' // text-responsive-question
    };

    const responsiveHeaderStyle = {
        letterSpacing: '-0.03em',
        fontSize: 'clamp(14px, calc(16px * (100vw / 390px)), 20px)' // text-responsive-header
    };

    const responsiveButtonStyle = {
        lineHeight: '1.2',
        fontSize: 'clamp(16px, calc(18px * (100vw / 390px)), 22px)' // text-responsive-button
    };

    return (
        <div
            className={`tw-w-full tw-bg-gray-100 tw-flex tw-flex-col ${className}`}
            style={{
                fontFamily: 'Pretendard, sans-serif',
                backgroundColor: '#f3f4f6',
                height: isSafari ? `calc(var(--vh, 1vh) * 100)` : '100vh',
                minHeight: isSafari ? `calc(var(--vh, 1vh) * 100)` : '100vh',
                overflowX: 'hidden',
                position: 'relative'
            }}
        >
            {isLoading ? (
                <div className="tw-flex tw-items-center tw-justify-center tw-h-full">
                    <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-orange-500 tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mx-auto tw-mb-4"></div>
                </div>
            ) : (
                <>
                    {/* 상단 영역 */}
                    <div className="tw-flex-shrink-0 tw-px-4 tw-pt-6">
                        <button
                            className="tw-p-3 tw-mb-4 -tw-ml-2 tw-self-start tw-bg-transparent tw-border-none tw-cursor-pointer hover:tw-bg-gray-200 tw-rounded-full tw-transition-colors tw-flex tw-items-center tw-justify-center"
                            onClick={onBack || (() => window.history.back())}
                            aria-label="뒤로가기"
                        >
                            <BackArrow color="#140805" />
                        </button>

                        <div className="tw-space-y-6">
                            <span className="tw-font-semibold tw-text-gray-600" style={responsiveHeaderStyle}>
                                {questionNumber} / {totalQuestions}
                            </span>

                            <h2 className="tw-font-semibold tw-text-black" style={responsiveQuestionStyle}>
                                {question.split(' ').length > 8 ?
                                    question.replace(/(.{20,}?)\s/g, '$1\n').split('\n').map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            {index < question.replace(/(.{20,}?)\s/g, '$1\n').split('\n').length - 1 && <br />}
                                        </span>
                                    )) :
                                    question
                                }
                            </h2>
                        </div>
                    </div>

                    <div className="tw-flex-1"></div>

                    {/* 하단 영역 - Fixed positioning */}
                    <div
                        className="tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-gap-3 tw-px-6 tw-justify-center tw-bg-gray-100 tw-pb-8 tw-pt-4"
                        style={{
                            paddingBottom: isSafari ? 'max(env(safe-area-inset-bottom), 2rem)' : '2rem',
                            zIndex: 10
                        }}
                    >
                        <button
                            onClick={() => handleAnswerSelect(false)}
                            className={`tw-w-[160px] tw-h-[180px] tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-font-bold tw-border-none tw-cursor-pointer tw-transition-transform active:tw-scale-95 ${selectedAnswer === false
                                ? 'tw-bg-orange-500 tw-text-white'
                                : 'tw-bg-white tw-text-black'
                                }`}
                            disabled={isLoading || selectedAnswer !== null}
                            aria-label="아니오"
                            style={responsiveButtonStyle}
                        >
                            아니오
                        </button>

                        <button
                            onClick={() => handleAnswerSelect(true)}
                            className={`tw-w-[160px] tw-h-[180px] tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-font-bold tw-border-none tw-cursor-pointer tw-transition-transform active:tw-scale-95 ${selectedAnswer === true
                                ? 'tw-bg-orange-500 tw-text-white'
                                : 'tw-bg-white tw-text-black'
                                }`}
                            disabled={isLoading || selectedAnswer !== null}
                            aria-label="예"
                            style={responsiveButtonStyle}
                        >
                            예
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
