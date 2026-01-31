import React from 'react';

// Shim for next/image
// Since we don't have Next.js image optimization, we just render a standard img tag.
// We filter out Next.js specific props that valid HTML img tags don't support.

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    placeholder?: string;
    blurDataURL?: string;
    loader?: any;
    unoptimized?: boolean;
}

const NextImageShim: React.FC<ImageProps> = ({
    src,
    alt,
    width,
    height,
    fill,
    quality,
    priority,
    placeholder,
    blurDataURL,
    loader,
    unoptimized,
    style,
    className,
    ...props
}) => {
    // If 'fill' is true, Next.js makes the image absolute to fill the container.
    // We can mimic this with styles.
    const fillStyles: React.CSSProperties = fill
        ? {
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            objectFit: 'cover',
            ...style,
        }
        : style;

    return (
        <img
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            className={className}
            style={fillStyles}
            {...props}
        />
    );
};

export default NextImageShim;
