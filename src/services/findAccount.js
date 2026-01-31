/**
 * 아이디/비밀번호 찾기 Mock API 서비스
 *
 * 백엔드 API 연동 전까지 Mock 데이터 사용
 */

// Mock 데이터
const MOCK_USERS = [
    {
        name: '김철수',
        phone: '010-1234-5678',
        email: 'qwer1234@univ.com',
        joinDate: '2024.01.15'
    },
    {
        name: '테스트',
        phone: '010-0000-0000',
        email: 'test@test.com',
        joinDate: '2024.06.01'
    }
];

const TEST_VERIFICATION_CODE = '123456';

/**
 * 휴대폰 번호 포맷팅 (010-XXXX-XXXX)
 * @param {string} value - 입력값
 * @returns {string} - 포맷팅된 번호
 */
export const formatPhoneNumber = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
};

/**
 * 아이디 찾기 - SMS 인증번호 요청
 * @param {Object} data - { name, carrier, phone }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const requestFindIdSms = async (data) => {
    // 필수 필드 검증
    if (!data.name || !data.carrier || !data.phone) {
        throw new Error('모든 필드를 입력해주세요.');
    }

    // Mock: 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock: 항상 성공
    console.log('📱 [Mock] 아이디 찾기 SMS 발송:', data.phone);

    return {
        success: true,
        message: '인증번호가 전송되었습니다. (테스트: 123456)'
    };
};

/**
 * 아이디 찾기 - 인증번호 확인
 * @param {Object} data - { name, phone, code }
 * @returns {Promise<{success: boolean, email: string, joinDate: string}>}
 */
export const verifyFindIdCode = async (data) => {
    // Mock: 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    // 테스트 인증번호 확인
    if (data.code !== TEST_VERIFICATION_CODE) {
        throw new Error('인증번호가 일치하지 않습니다.');
    }

    // Mock: 사용자 찾기
    const user = MOCK_USERS.find(u => u.phone === data.phone && u.name === data.name);

    if (user) {
        console.log('✅ [Mock] 아이디 찾기 성공:', user.email);
        return {
            success: true,
            email: user.email,
            joinDate: user.joinDate
        };
    }

    // 매칭되는 사용자가 없어도 테스트용 기본값 반환
    console.log('✅ [Mock] 아이디 찾기 성공 (기본값)');
    return {
        success: true,
        email: 'qwer1234@univ.com',
        joinDate: '2024.01.15'
    };
};

/**
 * 비밀번호 찾기 - 재설정 이메일 발송
 * @param {string} email - 이메일 주소
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const requestPasswordReset = async (email) => {
    // 필수 필드 검증
    if (!email) {
        throw new Error('이메일을 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('올바른 이메일 형식을 입력해주세요.');
    }

    // Mock: 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('📧 [Mock] 비밀번호 재설정 이메일 발송:', email);

    return {
        success: true,
        message: '비밀번호 재설정 이메일이 발송되었습니다.'
    };
};

/**
 * 비밀번호 찾기 - 인증번호 확인
 * @param {string} email - 이메일 주소
 * @param {string} code - 6자리 인증번호
 * @returns {Promise<{success: boolean}>}
 */
export const verifyPasswordResetCode = async (email, code) => {
    // Mock: 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    // 테스트 인증번호 확인
    if (code !== TEST_VERIFICATION_CODE) {
        throw new Error('인증번호가 일치하지 않습니다.');
    }

    console.log('✅ [Mock] 비밀번호 재설정 인증번호 확인 성공:', email);

    return { success: true };
};

/**
 * 비밀번호 재설정
 * @param {Object} data - { email, newPassword }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPassword = async (data) => {
    // 필수 필드 검증
    if (!data.newPassword) {
        throw new Error('새 비밀번호를 입력해주세요.');
    }

    // 비밀번호 형식 검증 (영문+숫자 혼용 8자 이상, 특수문자 허용)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(data.newPassword)) {
        throw new Error('비밀번호는 영문, 숫자를 혼용해 8자 이상으로 설정하세요.');
    }

    // Mock: 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🔐 [Mock] 비밀번호 재설정 완료');

    return {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
    };
};

/**
 * 비밀번호 유효성 검사
 * @param {string} password - 비밀번호
 * @returns {{isValid: boolean, message: string}}
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: '' };
    }

    if (password.length < 8) {
        return {
            isValid: false,
            message: '비밀번호는 영문, 숫자를 혼용해 8자 이상으로 설정하세요.'
        };
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasLetter || !hasNumber) {
        return {
            isValid: false,
            message: '비밀번호는 영문, 숫자를 혼용해 8자 이상으로 설정하세요.'
        };
    }

    return { isValid: true, message: '' };
};

/**
 * 비밀번호 확인 검사
 * @param {string} password - 비밀번호
 * @param {string} confirmPassword - 비밀번호 확인
 * @returns {{isValid: boolean, message: string}}
 */
export const validatePasswordConfirm = (password, confirmPassword) => {
    if (!confirmPassword) {
        return { isValid: false, message: '' };
    }

    if (password !== confirmPassword) {
        return {
            isValid: false,
            message: '비밀번호가 일치하지 않습니다.'
        };
    }

    return { isValid: true, message: '' };
};
