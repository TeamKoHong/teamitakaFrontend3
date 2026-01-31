import { useEffect, useState } from 'react';

interface BrowserOptimization {
    isSafari: boolean;
    isChrome: boolean;
    isFirefox: boolean;
    isMobile: boolean;
    imageClass: string;
    layoutClass: string;
}

export const useBrowserOptimization = (): BrowserOptimization => {
    const [optimization, setOptimization] = useState<BrowserOptimization>({
        isSafari: false,
        isChrome: false,
        isFirefox: false,
        isMobile: false,
        imageClass: '',
        layoutClass: ''
    });

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
        const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
        const isFirefox = /Firefox/.test(userAgent);
        const isMobile = /Mobi|Android/i.test(userAgent);

        let imageClass = 'tw-image-ratio-fix';
        let layoutClass = '';

        if (isSafari) {
            imageClass += ' tw-safari-image-fix';
            layoutClass += ' tw-safari-optimized';
        } else if (isChrome) {
            imageClass += ' tw-chrome-image-fix';
            layoutClass += ' tw-chrome-optimized';
        } else if (isFirefox) {
            imageClass += ' tw-firefox-image-fix';
            layoutClass += ' tw-firefox-optimized';
        }

        if (isMobile) {
            layoutClass += ' tw-mobile-optimized';
        }

        setOptimization({
            isSafari,
            isChrome,
            isFirefox,
            isMobile,
            imageClass,
            layoutClass
        });
    }, []);

    return optimization;
};
