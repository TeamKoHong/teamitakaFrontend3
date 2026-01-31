import React from 'react';

interface ChoiceButtonProps {
    children: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function ChoiceButton({
    children,
    selected,
    onClick,
    disabled = false,
    variant = 'primary',
    className = ''
}: ChoiceButtonProps) {

    // Converted from globals.css .choice-button, .choice-button.selected/unselected
    const baseStyle = "tw-w-full tw-p-4 tw-text-left tw-rounded-2xl tw-border-2 tw-transition-all tw-duration-200 tw-font-medium tw-hover:shadow-md tw-active:scale-95 tw-focus:ring-2 tw-focus:ring-primary tw-focus:ring-opacity-50";

    const stateStyle = selected
        ? "tw-bg-primary tw-border-primary tw-text-white tw-shadow-lg tw-transform tw-scale-105"
        : "tw-bg-white tw-border-gray-200 tw-text-gray-700 tw-hover:border-gray-300 dark:tw-bg-dark-card dark:tw-border-gray-600 dark:tw-text-white";

    const cursorStyle = disabled ? "tw-opacity-50 tw-cursor-not-allowed" : "tw-cursor-pointer";

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseStyle} ${stateStyle} ${cursorStyle} ${className}`}
            type="button"
            aria-pressed={selected}
        >
            {children}
        </button>
    );
}
