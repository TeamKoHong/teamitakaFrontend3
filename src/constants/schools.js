/**
 * 학교 이메일 도메인 매핑
 * 회원가입 시 입력한 학교 이메일로 학교명을 자동 감지
 */

export const SCHOOL_EMAIL_DOMAINS = {
    // 서울권
    'snu.ac.kr': '서울대학교',
    'yonsei.ac.kr': '연세대학교',
    'korea.ac.kr': '고려대학교',
    'skku.edu': '성균관대학교',
    'hanyang.ac.kr': '한양대학교',
    'cau.ac.kr': '중앙대학교',
    'khu.ac.kr': '경희대학교',
    'ewha.ac.kr': '이화여자대학교',
    'sogang.ac.kr': '서강대학교',
    'hufs.ac.kr': '한국외국어대학교',
    'uos.ac.kr': '서울시립대학교',
    'sungshin.ac.kr': '성신여자대학교',
    'duksung.ac.kr': '덕성여자대학교',
    'dongguk.edu': '동국대학교',
    'hongik.ac.kr': '홍익대학교',
    'konkuk.ac.kr': '건국대학교',
    'kw.ac.kr': '광운대학교',
    'sejong.ac.kr': '세종대학교',
    'ssu.ac.kr': '숭실대학교',
    'sm.ac.kr': '숙명여자대학교',

    // 과학기술 특성화
    'kaist.ac.kr': '카이스트',
    'postech.ac.kr': '포스텍',
    'gist.ac.kr': '지스트',
    'unist.ac.kr': '유니스트',
    'dgist.ac.kr': '디지스트',

    // 지방 거점
    'pusan.ac.kr': '부산대학교',
    'knu.ac.kr': '경북대학교',
    'jnu.ac.kr': '전남대학교',
    'jbnu.ac.kr': '전북대학교',
    'cnu.ac.kr': '충남대학교',
    'chungbuk.ac.kr': '충북대학교',
    'kangwon.ac.kr': '강원대학교',
    'gnu.ac.kr': '경상대학교',
    'jejunu.ac.kr': '제주대학교',

    // 인천/경기
    'inha.ac.kr': '인하대학교',
    'ajou.ac.kr': '아주대학교',
    'kgu.ac.kr': '경기대학교',
    'inu.ac.kr': '인천대학교',

    // 기타 주요 대학
    'dgu.ac.kr': '동국대학교',
    'catholic.ac.kr': '가톨릭대학교',
    'kookmin.ac.kr': '국민대학교',
    'dankook.ac.kr': '단국대학교',
    'soongsil.ac.kr': '숭실대학교',
    'mju.ac.kr': '명지대학교',
    'sangmyung.kr': '상명대학교',
};

/**
 * 이메일 주소에서 학교명 추출
 * @param {string} email - 학교 이메일 주소
 * @returns {string|null} - 학교명 또는 null
 */
export const getSchoolFromEmail = (email) => {
    if (!email || typeof email !== 'string') return null;

    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;

    const domain = email.slice(atIndex + 1).toLowerCase();

    // 직접 매핑 확인
    if (SCHOOL_EMAIL_DOMAINS[domain]) {
        return SCHOOL_EMAIL_DOMAINS[domain];
    }

    // 서브도메인 처리 (예: mail.snu.ac.kr -> snu.ac.kr)
    const parts = domain.split('.');
    if (parts.length > 2) {
        const mainDomain = parts.slice(-3).join('.');
        if (SCHOOL_EMAIL_DOMAINS[mainDomain]) {
            return SCHOOL_EMAIL_DOMAINS[mainDomain];
        }
        // ac.kr 또는 edu 도메인
        const altDomain = parts.slice(-2).join('.');
        if (altDomain === 'ac.kr' || altDomain === 'edu') {
            const schoolDomain = parts.slice(-3).join('.');
            if (SCHOOL_EMAIL_DOMAINS[schoolDomain]) {
                return SCHOOL_EMAIL_DOMAINS[schoolDomain];
            }
        }
    }

    return null;
};

/**
 * 이메일 도메인 유효성 검사
 * @param {string} email - 학교 이메일 주소
 * @returns {boolean} - 유효한 학교 이메일인지 여부
 */
export const isValidSchoolEmail = (email) => {
    return getSchoolFromEmail(email) !== null;
};

/**
 * 학교 단축명 매핑
 * UI에서 짧은 이름으로 표시할 때 사용
 */
export const SHORT_SCHOOL_NAMES = {
    // 서울권
    '서울대학교': '서울대',
    '연세대학교': '연세대',
    '고려대학교': '고려대',
    '성균관대학교': '성대',
    '한양대학교': '한양대',
    '중앙대학교': '중대',
    '경희대학교': '경희대',
    '이화여자대학교': '이대',
    '서강대학교': '서강대',
    '한국외국어대학교': '외대',
    '서울시립대학교': '시립대',
    '성신여자대학교': '성신여대',
    '덕성여자대학교': '덕성여대',
    '동국대학교': '동국대',
    '홍익대학교': '홍대',
    '건국대학교': '건대',
    '광운대학교': '광운대',
    '세종대학교': '세종대',
    '숭실대학교': '숭실대',
    '숙명여자대학교': '숙대',

    // 과학기술 특성화
    '카이스트': 'KAIST',
    '포스텍': '포항공대',
    '지스트': 'GIST',
    '유니스트': 'UNIST',
    '디지스트': 'DGIST',

    // 지방 거점
    '부산대학교': '부산대',
    '경북대학교': '경북대',
    '전남대학교': '전남대',
    '전북대학교': '전북대',
    '충남대학교': '충남대',
    '충북대학교': '충북대',
    '강원대학교': '강원대',
    '경상대학교': '경상대',
    '제주대학교': '제주대',

    // 인천/경기
    '인하대학교': '인하대',
    '아주대학교': '아주대',
    '경기대학교': '경기대',
    '인천대학교': '인천대',

    // 기타
    '가톨릭대학교': '가톨릭대',
    '국민대학교': '국민대',
    '단국대학교': '단국대',
    '명지대학교': '명지대',
    '상명대학교': '상명대',
};

/**
 * 학교 전체 이름을 단축명으로 변환
 * @param {string} fullName - 학교 전체 이름 (예: "고려대학교")
 * @returns {string} - 단축명 (예: "고려대") 또는 원본
 */
export const getShortSchoolName = (fullName) => {
    if (!fullName) return null;
    return SHORT_SCHOOL_NAMES[fullName] || fullName.replace('대학교', '대');
};

/**
 * 학교명을 정규화 (비교용)
 * "고려대", "고려대학교", "Korea University" → "고려대학교"
 * @param {string} name - 학교명
 * @returns {string|null} - 정규화된 학교명 또는 null
 */
export const normalizeUniversity = (name) => {
    if (!name || typeof name !== 'string') return null;

    const trimmed = name.trim();

    // 이미 정규 학교명인 경우
    if (Object.values(SCHOOL_EMAIL_DOMAINS).includes(trimmed)) {
        return trimmed;
    }

    // 단축명 → 전체명 역변환
    const shortToFull = {};
    Object.entries(SHORT_SCHOOL_NAMES).forEach(([full, short]) => {
        shortToFull[short] = full;
        shortToFull[short.toLowerCase()] = full;
    });

    if (shortToFull[trimmed]) {
        return shortToFull[trimmed];
    }

    // "대" → "대학교" 변환 시도
    if (trimmed.endsWith('대') && !trimmed.endsWith('대학교')) {
        const fullName = trimmed + '학교';
        if (Object.values(SCHOOL_EMAIL_DOMAINS).includes(fullName)) {
            return fullName;
        }
    }

    return trimmed;
};

/**
 * 두 학교명이 같은 학교인지 확인
 * @param {string} a - 첫 번째 학교명
 * @param {string} b - 두 번째 학교명
 * @returns {boolean} - 같은 학교인지 여부
 */
export const isSameUniversity = (a, b) => {
    if (!a || !b) return false;

    const normalizedA = normalizeUniversity(a);
    const normalizedB = normalizeUniversity(b);

    if (!normalizedA || !normalizedB) return false;

    return normalizedA === normalizedB;
};
