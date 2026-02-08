import React from 'react';
import './CompletedProjectSimpleCard.module.scss';
import styles from './CompletedProjectSimpleCard.module.scss';
import { IoStar, IoStarOutline } from "react-icons/io5";
import { showErrorToast } from '../../../utils/toast';

const CompletedProjectSimpleCard = ({ project, onClick }) => {
    // TODO: Connect to actual bookmark API
    const [isStarred, setIsStarred] = React.useState(project.is_favorite || false);

    // Update local state if prop changes (e.g. list refresh)
    React.useEffect(() => {
        setIsStarred(project.is_favorite || false);
    }, [project.is_favorite]);

    const handleStarClick = async (e) => {
        e.stopPropagation(); // Prevent card click

        // 1. Optimistic Update
        const previousState = isStarred;
        setIsStarred(!previousState);

        try {
            // 2. API Call
            const { toggleProjectFavorite } = await import('../../../services/projects');
            await toggleProjectFavorite(project.project_id);
        } catch (error) {

            // 3. Rollback on failure
            setIsStarred(previousState);
            showErrorToast('즐겨찾기 변경에 실패했습니다.');
        }
    };

    return (
        <div
            className={styles.completedCard}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.subtitle}>{project.description || '프로젝트 설명이 없습니다.'}</p>
                </div>

                <div className={styles.iconWrapper} onClick={handleStarClick}>
                    {isStarred ? (
                        <IoStar className={`${styles.starIcon} ${styles.filled}`} />
                    ) : (
                        <IoStarOutline className={`${styles.starIcon} ${styles.outline}`} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedProjectSimpleCard;
