import React, { useState } from 'react';
import { TYPE_METADATA } from 'features/type-test/lib/types';

interface ShareBarProps {
    typeCode: string;
    nickname: string;
    onRetest: () => void;
    className?: string;
}

export default function ShareBar({ typeCode, nickname, onRetest, className = '' }: ShareBarProps) {
    const [isSharing, setIsSharing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const shareData = {
                title: `나는 ${nickname}!`,
                text: `TEAMITAKA 타입 테스트 결과: ${nickname} - 나의 협업 타입을 확인해보세요!`,
                url: window.location.origin + `/result/${encodeURIComponent(typeCode)}`
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                showToast('공유가 완료되었습니다!');
            } else {
                await navigator.clipboard.writeText(shareData.url);
                showToast('링크가 복사되었습니다!');
            }
        } catch (error) {
            console.error('공유 실패:', error);
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast('링크가 복사되었습니다!');
            } catch {
                showToast('공유에 실패했습니다.');
            }
        } finally {
            setIsSharing(false);
        }
    };

    const handleSaveImage = async () => {
        setIsSaving(true);
        try {
            // Use English ID for file path to avoid encoding issues
            const typeMeta = TYPE_METADATA[typeCode];
            const imageId = typeMeta?.id || 'unknown'; // Should not happen if data is correct

            const imagePath = `/assets/saved-image/${imageId}.png`;
            const fileName = `${nickname}.png`;

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

            showToast('이미지가 저장되었습니다!');

        } catch (error) {
            console.error('이미지 저장 실패:', error);
            showToast('이미지 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* share-bar logic: fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 */}
            <div className={`tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-border-t tw-border-gray-200 tw-p-4 tw-flex tw-gap-3 dark:tw-bg-dark-card dark:tw-border-gray-600 ${className}`}>
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-py-3 tw-px-4 
                     tw-bg-gray-100 tw-hover:tw-bg-gray-200 tw-rounded-2xl tw-transition-colors
                     dark:tw-bg-gray-700 dark:tw-hover:tw-bg-gray-600
                     disabled:tw-opacity-50"
                >
                    {isSharing ? (
                        <div className="tw-w-5 tw-h-5 tw-border-2 tw-border-gray-400 tw-border-t-transparent tw-rounded-full tw-animate-spin" />
                    ) : (
                        <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    )}
                    <span style={{ fontSize: 'clamp(16px, calc(18px * (100vw / 390px)), 22px)' }}>카드 공유</span>
                </button>

                {/* btn-primary: bg-primary text-white font-semibold py-3 px-6 rounded-2xl shadow-card transition-all... */}
                <button
                    onClick={handleSaveImage}
                    disabled={isSaving}
                    className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-py-3 tw-px-4 
                     tw-bg-primary tw-text-white tw-font-semibold tw-rounded-2xl 
                     tw-shadow-md tw-transition-all tw-duration-200 tw-hover:tw-shadow-lg tw-active:tw-scale-95
                     disabled:tw-opacity-50"
                >
                    {isSaving ? (
                        <div className="tw-w-5 tw-h-5 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin" />
                    ) : (
                        <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                    <span style={{ fontSize: 'clamp(16px, calc(18px * (100vw / 390px)), 22px)' }}>이미지로 저장하기</span>
                </button>
            </div>

            <div className="tw-text-center tw-mt-4 tw-mb-6">
                <button
                    onClick={onRetest}
                    className="tw-text-primary tw-hover:tw-text-primary/80 tw-underline tw-transition-colors"
                    style={{ fontSize: 'clamp(12px, calc(14px * (100vw / 390px)), 18px)' }}
                >
                    테스트 다시하기
                </button>
            </div>

            {toast && (
                <div className="tw-fixed tw-top-4 tw-left-1/2 tw-transform -tw-translate-x-1/2 
                       tw-bg-gray-800 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-lg
                       tw-z-50 tw-animate-fade-in"
                    style={{ fontSize: 'clamp(12px, calc(14px * (100vw / 390px)), 18px)' }}>
                    {toast}
                </div>
            )}
        </>
    );
}
