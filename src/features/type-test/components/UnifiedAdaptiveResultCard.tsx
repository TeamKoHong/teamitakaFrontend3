import React, { useState } from 'react';
import { TypeMeta } from 'features/type-test/lib/types';

interface UnifiedAdaptiveResultCardProps {
    typeMeta: TypeMeta;
    isDark?: boolean;
    className?: string;
    onRetest?: () => void;
}

export default function UnifiedAdaptiveResultCard({
    typeMeta,
    isDark = false,
    className = '',
    onRetest
}: UnifiedAdaptiveResultCardProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveImage = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);

            const imagePath = `/assets/saved-image/${typeMeta.id}.png`;
            const fileName = `${typeMeta.nickname}_result.png`;

            const response = await fetch(imagePath);
            if (!response.ok) {
                throw new Error('이미지를 찾을 수 없습니다.');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {

            alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            id="result-card"
            className={`tw-w-full tw-max-w-md tw-mx-auto tw-text-white tw-font-sans ${className}`}
            style={{
                fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
                backgroundColor: '#323030'
            }}
        >
            <div
                id="result-card-content"
                style={{
                    backgroundColor: 'transparent',
                    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
                    color: '#ffffff',
                    lineHeight: 1.6
                }}
            >
                {/* 상단 top.png 이미지 */}
                <div className="tw-mb-4 tw-px-4">
                    <img
                        src="/assets/result/top.png"
                        alt="Top"
                        className="tw-w-full tw-h-auto tw-object-contain"
                    />
                </div>

                {/* 캐릭터 이미지 */}
                <div
                    className="tw-px-4"
                    style={{ marginBottom: 'clamp(24px, calc(48px * (100vw / 390px)), 72px)' }}
                >
                    <img
                        src={`/assets/result/${typeMeta.id}.png`}
                        alt={typeMeta.nickname}
                        className="tw-w-full tw-h-auto tw-object-contain"
                    />
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="tw-px-6 tw-pb-8">
                <div className="tw-flex tw-space-x-3">
                    <button
                        onClick={() => {
                            if ((navigator as any).share) {
                                (navigator as any).share({
                                    title: `나는 ${typeMeta.nickname}!`,
                                    text: `TEAMITAKA 타입 테스트 결과: ${typeMeta.nickname}`,
                                    url: window.location.href
                                });
                            }
                        }}
                        className="tw-flex-1 tw-bg-white tw-py-3 tw-rounded-lg tw-text-sm tw-font-medium tw-flex tw-items-center tw-justify-center tw-space-x-2"
                        style={{ color: '#000' }}
                    >
                        <span>카드 공유</span>
                        <img
                            src="/assets/result/share.svg"
                            alt="공유"
                            className="tw-w-4 tw-h-4"
                        />
                    </button>
                    <button
                        onClick={handleSaveImage}
                        disabled={isSaving}
                        className="tw-flex-1 tw-py-3 tw-rounded-lg tw-text-sm tw-font-medium tw-flex tw-items-center tw-justify-center tw-space-x-2 disabled:tw-opacity-50 tw-text-white"
                        style={{ backgroundColor: '#FF6633' }}
                    >
                        <span>{isSaving ? '저장 중...' : '카드 저장'}</span>
                        <img
                            src="/assets/result/download.svg"
                            alt="다운로드"
                            className="tw-w-4 tw-h-4"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
