import React from 'react';
import styles from './TeamMemberAvatars.module.scss';

// 역할을 한글로 변환
const getRoleLabel = (role) => {
  const roleMap = {
    LEADER: '팀장',
    MEMBER: '팀원',
    FRONTEND: '프론트엔드',
    BACKEND: '백엔드',
    DESIGN: '디자인',
    PM: '기획',
  };
  return roleMap[role?.toUpperCase?.()] || role || '담당업무';
};

// 담당 업무 또는 역할 표시 (task 우선, 없으면 role)
const getTaskOrRole = (member) => {
  if (member.task) {
    return member.task;
  }
  return getRoleLabel(member.role);
};

export default function TeamMemberAvatars({
  members = [],
  selectedId = null,
  onSelect = null,
  selectable = false,
}) {
  if (!Array.isArray(members) || members.length === 0) return null;

  const handleClick = (memberId) => {
    if (selectable && onSelect) {
      onSelect(memberId);
    }
  };

  return (
    <section className={styles.wrapper} aria-label="팀원 목록">
      {members.map((member) => (
        <div
          key={member.id}
          className={`${styles.item} ${selectable ? styles.clickable : ''} ${selectedId === member.id ? styles.selected : ''}`}
          onClick={() => handleClick(member.id)}
          role={selectable ? 'button' : undefined}
          tabIndex={selectable ? 0 : undefined}
          onKeyDown={selectable ? (e) => e.key === 'Enter' && handleClick(member.id) : undefined}
        >
          <img
            src={member.avatar || '/icons/default-avatar.svg'}
            alt={member.name}
            className={styles.avatar}
          />
          <div className={styles.textGroup}>
            <span className={styles.name}>{member.name}</span>
            <span className={styles.role}>{getTaskOrRole(member)}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
