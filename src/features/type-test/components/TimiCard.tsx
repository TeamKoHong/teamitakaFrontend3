import React, { useState } from 'react';
import NextImageShim from 'shared/shims/NextImageShim';
import { safePublicSrc } from 'features/type-test/lib/imagePath'; // Need to migrate imagePath too!
import { useBrowserOptimization } from 'features/type-test/lib/hooks/useBrowserOptimization';

// Minimal inline version of imagePath if simple
// Or I should migrate imagePath.ts separately. I'll define a helper here if it's simple or migrate it next.
// Looking at usage: safePublicSrc(string) -> string. 
// I'll migrate imagePath.ts in a sec. For now I'll import it assuming I'll write it.

type TimiCardProps = {
    name: string;
    front: string;
    back: string;
    initialFace?: 'front' | 'back'
};

export default function TimiCard({
    name,
    front,
    back,
    initialFace = 'front'
}: TimiCardProps) {
    const [face, setFace] = useState<'front' | 'back'>(initialFace);
    const isFront = face === 'front';
    const browserOptimization = useBrowserOptimization();

    const handleFlip = () => {
        setFace(isFront ? 'back' : 'front');
    };

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-h-full">
            <button
                type="button"
                aria-pressed={!isFront}
                onClick={handleFlip}
                className="tw-group tw-relative tw-w-full tw-h-full tw-cursor-pointer tw-rounded-xl tw-outline-none tw-focus-visible:ring-2 tw-focus-visible:ring-indigo-400 tw-transition-transform tw-duration-300 tw-hover:scale-[1.02] tw-active:scale-[0.99]"
            >
                <div
                    className={`tw-relative tw-h-full tw-w-full tw-rounded-xl tw-shadow-md tw-transition-transform tw-duration-500 [transform-style:preserve-3d] ${isFront ? '' : '[transform:rotateY(180deg)]'
                        }`}
                >
                    {/* 앞면 */}
                    <div className="tw-absolute tw-inset-0 tw-rounded-xl tw-overflow-hidden [backface-visibility:hidden] tw-z-10">
                        <NextImageShim
                            // src={safePublicSrc(front)} // I need to migrate imagePath.ts
                            src={front} // Temporary direct use, assuming public folder structure matches
                            alt={`${name} 앞면`}
                            className={`tw-w-full tw-h-full tw-object-contain ${browserOptimization.imageClass}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                aspectRatio: 'auto'
                            }}
                        />
                    </div>

                    {/* 뒷면 */}
                    <div className="tw-absolute tw-inset-0 tw-rounded-xl tw-overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <NextImageShim
                            src={back}
                            alt={`${name} 뒷면`}
                            className={`tw-w-full tw-h-full tw-object-contain ${browserOptimization.imageClass}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                aspectRatio: 'auto'
                            }}
                        />
                    </div>
                </div>
            </button>
        </div>
    );
}
