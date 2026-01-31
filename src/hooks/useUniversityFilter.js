/**
 * 대학별 콘텐츠 필터링 훅
 * 배열 데이터를 현재 사용자 대학 기준으로 필터링
 */
import { useCallback } from 'react';
import { useUniversityFilterContext } from '../contexts/UniversityFilterContext';
import { isSameUniversity } from '../constants/schools';

/**
 * 대학별 필터링 기능을 제공하는 훅
 * @returns {Object} 필터링 관련 함수와 상태
 */
export const useUniversityFilter = () => {
    const {
        userUniversity,
        canUseUnivFilter,
        isUnivMode,
    } = useUniversityFilterContext();

    /**
     * 아이템이 현재 사용자 대학과 같은지 확인
     * @param {string} itemUniversity - 아이템의 대학명
     * @returns {boolean}
     */
    const isUnivMatch = useCallback((itemUniversity) => {
        if (!userUniversity || !itemUniversity) return false;
        return isSameUniversity(itemUniversity, userUniversity);
    }, [userUniversity]);

    /**
     * 배열을 대학 기준으로 필터링
     * @param {Array} items - 필터링할 배열
     * @param {string} universityKey - 대학 정보가 들어있는 키 (기본: 'university')
     * @returns {Array} - 필터링된 배열
     */
    const filterByUniv = useCallback((items, universityKey = 'university') => {
        if (!Array.isArray(items)) return [];

        // 대학 필터 사용 불가능한 경우 (비로그인 등) 전체 반환
        if (!isUnivMode) {
            return items;
        }

        // 로그인 사용자: 같은 대학만 필터링
        return items.filter(item => {
            const itemUniversity = item?.[universityKey];
            if (!itemUniversity) return false;
            return isUnivMatch(itemUniversity);
        });
    }, [isUnivMode, isUnivMatch]);

    /**
     * 필터 적용된 아이템 수 계산
     * @param {Array} items - 원본 배열
     * @param {string} universityKey - 대학 정보 키
     * @returns {Object} - { total, univOnly }
     */
    const getFilterStats = useCallback((items, universityKey = 'university') => {
        if (!Array.isArray(items)) return { total: 0, univOnly: 0 };

        const total = items.length;
        const univOnly = items.filter(item => {
            const itemUniversity = item?.[universityKey];
            return itemUniversity && isUnivMatch(itemUniversity);
        }).length;

        return { total, univOnly };
    }, [isUnivMatch]);

    return {
        // 상태
        isUnivMode,
        userUniversity,
        canUseUnivFilter,

        // 필터링 함수
        filterByUniv,
        isUnivMatch,
        getFilterStats,
    };
};

export default useUniversityFilter;
