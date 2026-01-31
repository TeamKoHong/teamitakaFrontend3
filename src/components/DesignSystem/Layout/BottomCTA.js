import React from 'react';
import styles from './BottomCTA.module.scss';

const BottomCTA = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {children}
            </div>
        </div>
    );
};

export default BottomCTA;
