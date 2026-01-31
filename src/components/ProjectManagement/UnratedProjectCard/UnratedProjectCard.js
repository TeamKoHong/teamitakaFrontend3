import React from 'react';
import styles from './UnratedProjectCard.module.scss';
import rightArrow from '../../../assets/icons/right-arrow.svg';

// 더미 아바타 이미지
const DEFAULT_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
];

const UnratedProjectCard = ({ project, onClick }) => {
    // 팀원 아바타 (API에 members 정보가 없으면 더미 사용)
    const memberAvatars = project.members && project.members.length > 0
        ? project.members.map(m => m.avatar || DEFAULT_AVATARS[0])
        : DEFAULT_AVATARS;

    return (
        <div
            className={styles.unratedCard}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.badge}>상호평가 진행 전</div>

            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.title}>{project.title}</h3>
                        <img src={rightArrow} alt="arrow" className={styles.nextArrow} />
                    </div>
                    <p className={styles.subtitle}>{project.description || '프로젝트 설명이 없습니다.'}</p>
                </div>

                <div className={styles.avatars}>
                    {memberAvatars.slice(0, 4).map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Member ${index + 1}`}
                            className={styles.avatar}
                            style={{ zIndex: 4 - index }}
                        />
                    ))}
                    {memberAvatars.length > 4 && (
                        <div className={styles.moreIndicator}>
                            <span>...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnratedProjectCard;
