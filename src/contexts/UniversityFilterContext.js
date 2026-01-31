/**
 * 대학별 콘텐츠 필터링 Context
 * 로그인 사용자: 자동으로 교내 콘텐츠만 표시
 * 비로그인 사용자: 전체 콘텐츠 표시
 */
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const UniversityFilterContext = createContext(null);

export const UniversityFilterProvider = ({ children }) => {
    const { user } = useAuth();

    // 사용자 대학 정보
    const userUniversity = user?.university || null;

    // 대학 필터 사용 가능 여부 (대학 정보가 있으면 자동 적용)
    const canUseUnivFilter = !!userUniversity;

    // 로그인 사용자면 자동으로 교내 모드
    const isUnivMode = canUseUnivFilter;

    const value = {
        userUniversity,
        canUseUnivFilter,
        isUnivMode,
    };

    return (
        <UniversityFilterContext.Provider value={value}>
            {children}
        </UniversityFilterContext.Provider>
    );
};

export const useUniversityFilterContext = () => {
    const context = useContext(UniversityFilterContext);
    if (!context) {
        throw new Error('useUniversityFilterContext must be used within a UniversityFilterProvider');
    }
    return context;
};

export default UniversityFilterContext;
