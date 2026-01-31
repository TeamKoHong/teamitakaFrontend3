import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className={`tw-w-full ${className}`}>
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                <span className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                    {current} / {total}
                </span>
                <span className="tw-text-sm tw-font-medium tw-text-primary">
                    {percentage}%
                </span>
            </div>
            {/* .progress-bar from globals.css */}
            <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2 dark:tw-bg-gray-700">
                {/* .progress-fill from globals.css */}
                <div
                    className="tw-bg-primary tw-h-2 tw-rounded-full tw-transition-all tw-duration-300"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`진행률 ${percentage}%`}
                />
            </div>
        </div>
    );
}
