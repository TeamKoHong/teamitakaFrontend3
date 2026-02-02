import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { verifyPhoneAuth } from '../../services/phoneAuth';
import './PhoneAuthForm.scss';

const PhoneAuthForm = () => {
  // 테스트 전용: AuthContext 연동 제거
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'code' | 'complete'

  // 개발자 디버깅 로그
  useEffect(() => {

  }, [step, phoneNumber, confirmationResult]);

  // 1️⃣ reCAPTCHA 초기화
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal', // visible 모드 (401 오류 방지 및 안정성)
        callback: () => {

        },
        'expired-callback': () => {

          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then((widgetId) => {
              window.grecaptcha.reset(widgetId);
            }).catch(err => {

            });
          }
        }
      });
    }
  };

  // 2️⃣ 전화번호 형식 변환 (010-1234-5678 → +821012345678)
  const formatPhoneNumber = (phone) => {
    // 하이픈 제거
    const cleaned = phone.replace(/-/g, '');

    // 010으로 시작하는 경우 +82로 변환
    if (cleaned.startsWith('010')) {
      return '+82' + cleaned.substring(1);
    }

    // 이미 +82로 시작하는 경우 그대로 반환
    if (cleaned.startsWith('+82')) {
      return cleaned;
    }

    // 그 외의 경우 +82 추가
    return '+82' + cleaned;
  };

  // 3️⃣ SMS 인증 코드 전송
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 전화번호 형식 검증
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('올바른 전화번호를 입력하세요.');
      }

      // E.164 형식으로 변환
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // 🧪 테스트 모드 (개발 및 배포 환경에서 사용 가능)
      if (process.env.REACT_APP_ENABLE_TEST_MODE === 'true' && formattedPhone === '+821012345678') {

        // 가짜 confirmationResult 객체 생성
        setConfirmationResult({
          confirm: async (code) => {
            if (code === '123456') {

              // 임시 사용자 객체 반환
              return {
                user: {
                  uid: 'test-user-' + Date.now(),
                  phoneNumber: formattedPhone,
                  getIdToken: async () => {
                    // 테스트용 임시 토큰 (백엔드에서 dev-test-token으로 검증)

                    return 'dev-test-token-' + Date.now();
                  }
                }
              };
            } else {
              throw new Error('인증 코드가 올바르지 않습니다. (테스트 코드: 123456)');
            }
          }
        });
        setStep('code');
        setLoading(false);
        return;
      }

      // reCAPTCHA 초기화
      setupRecaptcha();

      // Firebase에서 SMS 전송
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      setConfirmationResult(result);
      setStep('code');
    } catch (err) {

      // 상세한 에러 분석 및 사용자 친화적 메시지
      let userMessage = 'SMS 전송에 실패했습니다.';

      if (err.code === 'auth/invalid-phone-number') {
        userMessage = '올바르지 않은 전화번호 형식입니다. 다시 확인해주세요.';
      } else if (err.code === 'auth/too-many-requests') {
        userMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      } else if (err.code === 'auth/invalid-app-credential') {
        userMessage = 'Firebase 설정 오류입니다. 관리자에게 문의해주세요.';

      } else if (err.message && err.message.includes('reCAPTCHA')) {
        userMessage = 'reCAPTCHA 검증 실패. 페이지를 새로고침하고 다시 시도해주세요.';

      }

      setError(userMessage);

      // reCAPTCHA 리셋
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ 인증 코드 확인 및 백엔드 API 호출
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 인증 코드 검증
      if (!verificationCode || verificationCode.length !== 6) {
        throw new Error('6자리 인증 코드를 입력하세요.');
      }

      // Firebase에서 인증 코드 확인 및 ID Token 획득
      const credential = await confirmationResult.confirm(verificationCode);
      const idToken = await credential.user.getIdToken();

      // 백엔드 API 호출
      const response = await verifyPhoneAuth(idToken);

      // 🧪 테스트용: JWT 토큰과 사용자 정보를 localStorage에 저장 (디버깅용)
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // 테스트 성공 화면 표시 (AuthContext 연동 없음, 자동 리다이렉트 없음)
      setStep('complete');

    } catch (err) {

      setError(err.message || '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-auth-form">
      {step === 'phone' && (
        <form onSubmit={handleSendCode} className="auth-form">
          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              id="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container" className="recaptcha-container"></div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? '전송 중...' : '인증 코드 전송'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode} className="auth-form">
          <div className="form-group">
            <p className="info-message">
              📱 {phoneNumber}로 인증 코드를 전송했습니다.
            </p>
            <label htmlFor="code">인증 코드 (6자리)</label>
            <input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? '확인 중...' : '인증하기'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setVerificationCode('');
              setError('');
            }}
            className="secondary-button"
          >
            다른 번호로 시도
          </button>
        </form>
      )}

      {step === 'complete' && (
        <div className="success-message">
          <h3>✅ 번호 인증 성공!</h3>
          <p>백엔드 연동 테스트 완료 🎉</p>
        </div>
      )}
    </div>
  );
};

export default PhoneAuthForm;
