import React from 'react';
import styles from './ProjectInfoCard.module.scss';
import { formatDateRange, formatMeetingTime, calculateDaysFromStart } from '../../../utils/dateFormatters';
import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock.svg';

const ProjectInfoCard = ({ projectData, memberData, onMemberSelect, isLocked = false }) => {
    if (!projectData) return null;

    const dDay = calculateDaysFromStart(projectData.startDate);
    const dateRange = formatDateRange(projectData.startDate, projectData.endDate);
    const meetingTime = formatMeetingTime(projectData.meetingSchedule);
    const bgImage = projectData.backgroundImage || null;

    const handleMemberClick = (memberId) => {
        // Find the member to check if completed
        const targetMember = projectData.members.find(m => m.id === memberId);

        if (isLocked) {
            console.warn('평가 진행 중에는 다른 멤버를 선택할 수 없습니다.');
            // TODO: Add toast notification
            return;
        }

        // Prevent selection if completed
        if (targetMember && targetMember.status === 'completed') {
            console.warn('이미 평가가 완료된 멤버입니다.');
            // TODO: Add toast notification
            return;
        }

        if (onMemberSelect) {
            onMemberSelect(memberId);
        }
    };

    return (
        <div className={styles.projectInfoCard}>
            {/* Project Header with Background Image */}
            <div
                className={`${styles.projectHeader} ${bgImage ? styles.hasImage : ''} `}
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
            >
                <div className={styles.projectInfo}>
                    <div className={styles.projectTitle}>{projectData.name}</div>
                    <div className={styles.infoRow}>
                        <CalendarIcon className={styles.icon} aria-hidden="true" />
                        <span>{dateRange}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <ClockIcon className={styles.icon} aria-hidden="true" />
                        <span>{meetingTime}</span>
                    </div>
                </div>

                {/* D-day Badge - Absolute positioned */}
                <div className={styles.dDayBadge}>
                    {dDay}
                </div>
            </div>

            {/* Team Member Avatars */}
            <div className={styles.teamAvatars}>
                {projectData.members
                    .sort((a, b) => {
                        // Show completed members last
                        if (a.status === 'completed' && b.status !== 'completed') return 1;
                        if (a.status !== 'completed' && b.status === 'completed') return -1;
                        return 0;
                    })
                    .map((member) => {
                        const isCurrent = memberData && member.id === memberData.id;
                        const isCompleted = member.status === 'completed';
                        const isOtherMember = !isCurrent;
                        const isDisabled = isCompleted || (isLocked && isOtherMember);

                        return (
                            <div
                                key={member.id}
                                className={`${styles.avatarWrapper} ${isDisabled ? styles.disabled : ''} ${isLocked && isOtherMember ? styles.locked : ''}`}
                                onClick={() => handleMemberClick(member.id)}
                            >
                                <div className={`${styles.avatar} ${isCurrent ? styles.current : ''} ${isCompleted ? styles.completed : ''}`}>
                                    <img src={member.avatar} alt={member.name} />
                                    {isCompleted && (
                                        <div className={styles.completedBadge}>
                                            <span>✓</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.memberInfo}>
                                    <div className={styles.memberName}>{member.name}</div>
                                    <div className={styles.memberRole}>{member.position}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ProjectInfoCard;
