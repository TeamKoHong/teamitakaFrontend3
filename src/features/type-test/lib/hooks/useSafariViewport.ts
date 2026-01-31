import { useEffect, useState } from 'react';

export const useSafariViewport = () => {
    const [viewportHeight, setViewportHeight] = useState(0);
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        // Safari 감지
        const userAgent = navigator.userAgent;
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
        setIsSafari(isSafari);

        const updateViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            setViewportHeight(vh);
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        updateViewportHeight();

        if (isSafari) {
            // Safari에서 주소창 변화 감지
            window.addEventListener('resize', updateViewportHeight);
            window.addEventListener('orientationchange', updateViewportHeight);

            // 스크롤 이벤트로 주소창 상태 감지
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateViewportHeight();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('resize', updateViewportHeight);
                window.removeEventListener('orientationchange', updateViewportHeight);
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return { viewportHeight, isSafari };
};
