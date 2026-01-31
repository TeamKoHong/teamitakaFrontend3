import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useLocation } from 'shared/shims/useNextRouterShim';
import { TYPE_METADATA } from 'features/type-test/lib/types';
import { timiCards } from 'features/type-test/lib/data/timiCards';

export default function AnalysisCompletePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || '/';
    const [typeCode, setTypeCode] = useState<string>('');
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    useEffect(() => {
        const type = searchParams.get('type');
        if (type) {
            setTypeCode(type);
        }
    }, [searchParams]);

    const typeMeta = typeCode ? TYPE_METADATA[typeCode] : null;
    const currentTimiCard = typeMeta ? timiCards.find(card =>
        card.name === typeMeta.nickname
    ) : null;

    const handleViewDetails = () => {
        if (!typeCode) {
            alert('결과 정보를 불러올 수 없습니다. 다시 시도해주세요.');
            return;
        }
        router.push(`/type-test/result/${encodeURIComponent(typeCode)}`, { state: { from } });
    };

    return (
        <div
            className="tw-min-h-screen tw-relative tw-overflow-hidden"
            style={{
                fontFamily: 'Pretendard, sans-serif',
                height: '100vh',
                maxHeight: '100vh',
                backgroundColor: '#f2f2f2'
            }}
        >
            <div className="tw-flex tw-justify-center tw-relative">
                <img
                    src="/assets/analysis-complete/01.png"
                    alt="성향 분석 완료"
                    className="tw-w-auto tw-h-auto tw-object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                />
                <button
                    onClick={() => router.push(from)}
                    className="tw-absolute tw-w-8 tw-h-8 tw-bg-transparent tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-200 hover:tw-bg-opacity-20"
                    title="이전 페이지로 이동"
                    style={{ top: '16px', right: '16px' }}
                >
                    <span className="tw-text-transparent tw-text-lg tw-font-bold">×</span>
                </button>
            </div>

            <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-2">
                <div
                    className="tw-relative"
                    style={{ width: '358px', height: '517px' }}
                >
                    <div
                        className="tw-relative tw-cursor-pointer"
                        style={{ width: '100%', height: '100%', perspective: '1000px' }}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div
                            className={`tw-relative tw-w-full tw-h-full tw-transition-transform tw-duration-700 tw-ease-in-out`}
                            style={{
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Front */}
                            <div className="tw-absolute tw-inset-0 tw-w-full tw-h-full" style={{ backfaceVisibility: 'hidden' }}>
                                {currentTimiCard ? (
                                    <img
                                        src={currentTimiCard.front}
                                        alt={`${currentTimiCard.name} 캐릭터`}
                                        className="tw-w-full tw-h-full tw-object-contain"
                                    />
                                ) : (
                                    <div className="tw-w-full tw-h-full tw-bg-gray-300 tw-rounded-2xl tw-flex tw-items-center tw-justify-center">
                                        <div className="tw-text-center">🎴</div>
                                    </div>
                                )}
                            </div>

                            {/* Back */}
                            <div
                                className="tw-absolute tw-inset-0 tw-w-full tw-h-full"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                {currentTimiCard ? (
                                    <img
                                        src={currentTimiCard.back}
                                        alt={`${currentTimiCard.name} 뒷면`}
                                        className="tw-w-full tw-h-full tw-object-contain"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-w-full tw-px-4 tw-pt-8 tw-pb-8">
                <div className="tw-w-full tw-mb-4">
                    <button
                        onClick={handleViewDetails}
                        disabled={!typeCode}
                        className="tw-w-full tw-bg-gray-800 tw-text-white tw-py-4 tw-px-6 tw-rounded-lg tw-font-semibold tw-text-base disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-700 tw-transition-colors"
                    >
                        나의 성향 자세히 보기 →
                    </button>
                </div>

                <div className="tw-text-center">
                    <button
                        onClick={() => router.push('/type-test', { state: { from } })}
                        className="tw-text-gray-600 tw-underline hover:tw-text-gray-800 tw-transition-colors tw-text-sm tw-font-medium"
                    >
                        테스트 다시하기
                    </button>
                </div>
            </div>
        </div>
    );
}
