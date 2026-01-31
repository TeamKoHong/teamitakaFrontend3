// src/components/RatingManagement/RatingTabs/RatingTabs.js
import React from 'react';
import styles from './RatingTabs.module.scss';
import { PiCaretDownFill, PiCaretUpFill } from "react-icons/pi"; // 위/아래 아이콘 임포트

const RatingTabs = ({ activeTab, onTabChange, sortBy, sortOrder, onSortToggle }) => { // prop 추가
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabButtons}>
        <button
          className={`${styles.tab} ${activeTab === 'received' ? styles.active : ''}`}
          onClick={() => onTabChange('received')}
          type="button"
        >
          내가 받은 평가
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'given' ? styles.active : ''}`}
          onClick={() => onTabChange('given')}
          type="button"
        >
          내가 한 평가
        </button>
      </div>
      <div className={styles.sortOptions} onClick={onSortToggle}> {/* 클릭 이벤트 추가 */}
        <span>최신순</span>
        {sortOrder === 'desc' ? (
          <PiCaretDownFill className={styles.sortIcon} />
        ) : (
          <PiCaretUpFill className={styles.sortIcon} />
        )}
      </div>
    </div>
  );
};

export default RatingTabs;