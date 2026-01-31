import PhoneAuthForm from '../../components/auth/PhoneAuthForm';
import './PhoneAuthTestPage.scss';

export default function PhoneAuthTestPage() {
  return (
    <div className="phone-auth-test-page">
      {/* 테스트 페이지 헤더 */}
      <div className="test-warning">
        <h4>⚠️ 테스트 페이지</h4>
        <p>
          이 페이지는 Firebase 전화번호 인증 기능 테스트용입니다.
          <br />
          디자인 적용 전 임시 페이지입니다.
        </p>
      </div>

      {/* 페이지 타이틀 */}
      <div className="page-header">
        <h2>📱 전화번호 인증</h2>
        <p>Firebase Phone Authentication 테스트</p>
      </div>

      {/* 인증 폼 */}
      <PhoneAuthForm />

      {/* 디버깅 정보 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <h4>🔧 개발자 정보</h4>
          <div className="debug-item">
            <strong>백엔드 API:</strong> {process.env.REACT_APP_API_BASE_URL || '미설정'}
          </div>
          <div className="debug-item">
            <strong>Firebase Project:</strong> {process.env.REACT_APP_FIREBASE_PROJECT_ID || '미설정'}
          </div>
          <div className="debug-item">
            <strong>Node 환경:</strong> {process.env.NODE_ENV}
          </div>
          <p className="debug-note">
            💡 콘솔을 확인하여 상세 로그를 확인하세요.
          </p>
        </div>
      )}

      {/* 사용 방법 안내 */}
      <div className="usage-guide">
        <h4>📝 사용 방법</h4>
        <ol>
          <li>전화번호를 입력하세요 (예: 010-1234-5678)</li>
          <li>reCAPTCHA를 완료하세요</li>
          <li>SMS로 받은 6자리 인증 코드를 입력하세요</li>
          <li>인증 완료 후 자동으로 메인 페이지로 이동합니다</li>
        </ol>
        <div className="test-phone-info">
          <strong>🧪 테스트 모드 (개발 및 배포 환경에서 사용 가능):</strong>
          <br />
          전화번호: 010-1234-5678
          <br />
          인증 코드: 123456
          <br />
          <br />
          ℹ️ 이 전화번호를 사용하면 실제 SMS 없이 테스트할 수 있습니다.
          <br />
          다른 번호는 Firebase Phone Auth를 통해 실제 SMS가 발송됩니다.
        </div>
      </div>
    </div>
  );
}
