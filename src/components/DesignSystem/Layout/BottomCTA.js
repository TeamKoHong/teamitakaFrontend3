import React from 'react';
import styles from './BottomCTA.module.scss';

const BottomCTA = ({ children, variant = 'gradient' }) => {
    return (
        <div className={`${styles.container} ${variant === 'solid' ? styles.solid : ''}`}>
            <div className={styles.inner}>
                {children}
            </div>
        </div>
    );
};

export default BottomCTA;
