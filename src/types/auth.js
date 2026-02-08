/**
 * 휴대폰 본인인증 관련 타입 정의
 * @fileoverview 본인인증 플로우에서 사용되는 타입들을 JSDoc으로 정의
 */

/**
 * 통신사 코드
 * @typedef {'SKT' | 'KT' | 'LGU' | 'MVNO_SKT' | 'MVNO_KT' | 'MVNO_LGU'} CarrierType
 */

/**
 * 성별 코드 (주민등록번호 7번째 자리)
 * 1: 1900년대 남성, 2: 1900년대 여성
 * 3: 2000년대 남성, 4: 2000년대 여성
 * @typedef {'1' | '2' | '3' | '4'} GenderCode
 */

/**
 * 본인인증 단계
 * @typedef {'phone-input' | 'terms' | 'verification' | 'complete'} AuthStep
 */

/**
 * 휴대폰 본인인증 폼 데이터
 * @typedef {Object} PhoneAuthForm
 * @property {CarrierType} carrier - 통신사
 * @property {string} phone - 휴대폰 번호 (010-XXXX-XXXX)
 * @property {string} birthDate - 생년월일 6자리 (YYMMDD)
 * @property {GenderCode} genderCode - 성별 코드
 * @property {string} name - 이름
 */

/**
 * 약관 동의 항목
 * @typedef {Object} TermsAgreement
 * @property {boolean} personalInfo - 개인정보 이용 동의
 * @property {boolean} thirdParty - 제3자 정보제공 동의
 * @property {boolean} timitakaPrivacy - 티미타카 개인정보 수집 동의
 * @property {boolean} timitakaThirdParty - 티미타카 제3자 제공 동의
 * @property {boolean} uniqueId - 고유식별정보 수집 동의
 */

/**
 * 인증 상태
 * @typedef {Object} VerificationState
 * @property {boolean} isLoading - 로딩 중
 * @property {boolean} isSuccess - 성공 여부
 * @property {string|null} error - 에러 메시지
 * @property {number} remainingTime - 남은 시간 (초)
 * @property {number} attemptCount - 시도 횟수
 */

/**
 * 가입 진행 정보 (AuthContext용)
 * @typedef {Object} RegistrationState
 * @property {boolean} phoneVerified - 본인인증 완료 여부
 * @property {string|null} verifiedName - 인증된 실명
 * @property {string|null} verifiedPhone - 인증된 전화번호
 * @property {string|null} ci - CI값 (본인확인정보)
 */

/**
 * 통신사 옵션
 * @type {Array<{value: CarrierType, label: string}>}
 */
export const CARRIER_OPTIONS = [
    { value: 'SKT', label: 'SKT' },
    { value: 'KT', label: 'KT' },
    { value: 'LGU', label: 'LG U+' },
    { value: 'MVNO_SKT', label: 'SKT 알뜰폰' },
    { value: 'MVNO_KT', label: 'KT 알뜰폰' },
    { value: 'MVNO_LGU', label: 'LG U+ 알뜰폰' },
];

/**
 * 약관 목록
 * @type {Array<{id: string, label: string, required: boolean}>}
 */
export const TERMS_LIST = [
    { id: 'personalInfo', label: '개인정보 이용 동의', required: true, url: '/privacy' },
    { id: 'thirdParty', label: '제3자 정보제공 동의', required: true, url: '/privacy' },
    { id: 'timitakaPrivacy', label: '개인정보 수집 및 이용 동의 (티미타카)', required: true, url: '/privacy' },
    { id: 'timitakaThirdParty', label: '개인정보 제 3자 정보제공 동의 (티미타카)', required: true, url: '/privacy' },
    { id: 'uniqueId', label: '고유식별정보 수집 및 이용 동의 (티미타카)', required: true, url: '/terms' },
];

/**
 * 인증번호 타이머 초기값 (초)
 * @type {number}
 */
export const VERIFICATION_TIMEOUT = 180;

/**
 * 최대 인증 시도 횟수
 * @type {number}
 */
export const MAX_VERIFICATION_ATTEMPTS = 5;
