import React from 'react';
import styles from './PageLayout.module.scss';
import DefaultHeader from '../../Common/DefaultHeader';

const PageLayout = ({ title, onBack, onClose, backPath, hideHeader, children }) => {
    return (
        <div className={styles.pageContainer}>
            {!hideHeader && (
                <DefaultHeader
                    title={title}
                    onBack={onBack}
                    backPath={backPath}
                    rightElement={onClose && (
                        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    )}
                />
            )}
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
