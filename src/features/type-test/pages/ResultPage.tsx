import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useLocation } from 'shared/shims/useNextRouterShim';
import UnifiedAdaptiveResultCard from 'features/type-test/components/UnifiedAdaptiveResultCard';
import { TYPE_METADATA } from 'features/type-test/lib/types';

export default function ResultPage() {
    const router = useRouter();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || '/';
    const { type } = useParams();
    const rawTypeCode = type as string;
    const typeCode = rawTypeCode ? decodeURIComponent(rawTypeCode) : '';
    const [isLoading, setIsLoading] = useState(true);

    // Find TypeMeta by strictly matching code (legacy) or id (new English URLs)
    const typeMeta = (() => {
        if (!typeCode) return null;
        // 1. Try direct lookup (Korean Key)
        if (TYPE_METADATA[typeCode]) return TYPE_METADATA[typeCode];

        // 2. Try looking up by ID (English)
        return Object.values(TYPE_METADATA).find(meta => meta.id === typeCode) || null;
    })();

    useEffect(() => {
        // Force loading to finish regardless of whether we found data or not
        setIsLoading(false);

        if (!typeMeta) {
            // Optional: redirect logic could go here, but for now we just show empty or let the UI handle it
            // if (!isLoading) router.push('/'); 
            // ^ accessing isLoading inside useEffect like this might depend on stale closure if not careful,
            // but setting isLoading(false) above covers the state update.
        }
    }, [typeMeta, typeCode, router]);

    const handleRetest = () => {
        router.push('/type-test', { state: { from } });
    };

    if (isLoading || !typeMeta) {
        return (
            <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                <div className="tw-text-center">
                    <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-primary tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mx-auto tw-mb-4"></div>
                    <p className="tw-text-gray-500">결과를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tw-min-h-screen result-page" style={{ backgroundColor: '#323030' }}>
            <div className="tw-max-w-sm tw-mx-auto tw-relative">
                <button
                    onClick={() => router.push(from)}
                    className="tw-absolute tw-z-10"
                    style={{
                        width: '63.12px', height: '63.12px',
                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                        top: '20px', right: '20px'
                    }}
                    aria-label="메인으로 이동"
                />
            </div>

            <main className="tw-pt-4 tw-pb-8" style={{ backgroundColor: '#323030' }}>
                <div className="tw-max-w-sm tw-mx-auto">
                    <UnifiedAdaptiveResultCard
                        typeMeta={typeMeta}
                        isDark={true}
                        onRetest={handleRetest}
                    />
                </div>
            </main>
        </div>
    );
}
