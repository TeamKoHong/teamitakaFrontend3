# 이메일 인증 API 서비스

이 문서는 `src/services/auth.js`의 이메일 인증 관련 함수들의 사용법을 설명합니다.

## 주요 변경사항

### 1. API 통신 방식 변경
- **이전**: 복잡한 객체 전달 (`{ email, action: 'send-verification' }`)
- **현재**: 단순한 이메일 주소만 전달 (`{ email }`)

### 2. 함수 시그니처 변경
```javascript
// 이전
sendVerificationCode(emailData)
verifyCode(verificationData)
resendVerificationCode(emailData)

// 현재
sendVerificationCode(email, retryCount = 0)
verifyCode(email, code)
resendVerificationCode(email)
```

## 함수 목록

### 1. `sendVerificationCode(email, retryCount = 0)`

이메일 인증 코드를 전송합니다.

**매개변수:**
- `email` (string): 인증할 이메일 주소
- `retryCount` (number, 선택사항): 재시도 횟수 (기본값: 0)

**반환값:**
```javascript
{
  success: true,
  message: "인증번호가 이메일로 전송되었습니다.",
  data: {
    email: "user@example.com",
    expiresIn: 180,
    verificationCode: "123456" // 개발 환경에서만
  }
}
```

**에러 처리:**
- 이메일 형식 검증
- 자동 재시도 (최대 3회)
- 지수 백오프 적용
- 네트워크 에러 감지

### 2. `verifyCode(email, code)`

인증 코드를 검증합니다.

**매개변수:**
- `email` (string): 이메일 주소
- `code` (string): 인증 코드

**반환값:**
```javascript
{
  success: true,
  message: "이메일 인증이 완료되었습니다.",
  data: {
    email: "user@example.com",
    verified: true
  }
}
```

### 3. `resendVerificationCode(email)`

인증 코드를 재전송합니다.

**매개변수:**
- `email` (string): 이메일 주소

**반환값:**
```javascript
{
  success: true,
  message: "인증번호가 이메일로 전송되었습니다.",
  data: {
    email: "user@example.com",
    expiresIn: 180
  }
}
```

## 로딩 상태 관리

### 상태 관리 함수들
```javascript
import { 
  createLoadingState, 
  setLoading, 
  setError, 
  clearError 
} from '../services/auth';

// 초기 상태 생성
const initialState = createLoadingState();
// { isLoading: false, error: null, retryCount: 0 }

// 로딩 상태 설정
const loadingState = setLoading(initialState, true);
// { isLoading: true, error: null, retryCount: 0 }

// 에러 상태 설정
const errorState = setError(loadingState, '에러 메시지');
// { isLoading: false, error: '에러 메시지', retryCount: 1 }

// 에러 초기화
const clearedState = clearError(errorState);
// { isLoading: false, error: null, retryCount: 0 }
```

### React Hook 사용 예시
```javascript
import React from 'react';
import { useEmailVerification } from '../services/auth';

const EmailVerificationComponent = () => {
  const { 
    isLoading, 
    error, 
    retryCount, 
    sendCode, 
    verifyCode, 
    resendCode, 
    clearError 
  } = useEmailVerification();

  const handleSendCode = async (email) => {
    try {
      await sendCode(email);
      // 성공 처리
    } catch (error) {
      // 에러 처리 (자동으로 상태에 저장됨)
    }
  };

  return (
    <div>
      {isLoading && <div>로딩 중...</div>}
      {error && <div>에러: {error}</div>}
      {retryCount > 0 && <div>재시도: {retryCount}/3</div>}
      {/* UI 컴포넌트들 */}
    </div>
  );
};
```

## 에러 처리

### 에러 타입별 처리
```javascript
try {
  await sendVerificationCode(email);
} catch (error) {
  if (error.message.includes('이메일 형식')) {
    // 이메일 형식 오류
  } else if (error.message.includes('네트워크')) {
    // 네트워크 오류 (자동 재시도됨)
  } else if (error.message.includes('서버')) {
    // 서버 오류 (자동 재시도됨)
  } else {
    // 기타 오류
  }
}
```

### 재시도 로직
- **자동 재시도**: 408, 429, 500, 502, 503, 504 상태 코드
- **최대 재시도**: 3회
- **지수 백오프**: 1초, 2초, 3초 간격
- **네트워크 에러**: 자동 재시도

## 백엔드 API 스펙

### 요청 형식
```javascript
// POST /api/auth/send-verification
{
  "email": "user@example.com"
}

// POST /api/auth/verify-code
{
  "email": "user@example.com",
  "code": "123456"
}
```

### 응답 형식
```javascript
// 성공 응답
{
  "success": true,
  "message": "인증번호가 이메일로 전송되었습니다.",
  "data": {
    "email": "user@example.com",
    "expiresIn": 180,
    "verificationCode": "123456" // 개발 환경에서만
  }
}

// 에러 응답
{
  "error": "EMAIL_SEND_FAILED",
  "message": "이메일 발송에 실패했습니다.",
  "details": "SendGrid API Error: 400 - ..."
}
```

## 사용 예시

### 기본 사용법
```javascript
import { sendVerificationCode, verifyCode } from '../services/auth';

// 이메일 인증 코드 전송
const handleSendCode = async (email) => {
  try {
    const result = await sendVerificationCode(email);
    console.log('전송 성공:', result);
  } catch (error) {
    console.error('전송 실패:', error.message);
  }
};

// 인증 코드 검증
const handleVerifyCode = async (email, code) => {
  try {
    const result = await verifyCode(email, code);
    console.log('검증 성공:', result);
  } catch (error) {
    console.error('검증 실패:', error.message);
  }
};
```

### React 컴포넌트에서 사용
```javascript
import React, { useState } from 'react';
import { sendVerificationCode } from '../services/auth';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendVerificationCode(email);
      alert('인증 코드가 전송되었습니다.');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '전송 중...' : '인증 코드 전송'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
```

## 주의사항

1. **이메일 형식 검증**: 프론트엔드에서 기본 검증 후 백엔드에서 재검증
2. **재시도 제한**: 최대 3회까지 자동 재시도
3. **에러 메시지**: 사용자에게 친화적인 메시지 표시
4. **로딩 상태**: 사용자 경험을 위한 로딩 상태 관리 필수
5. **네트워크 에러**: 자동 재시도되므로 사용자에게 알림 필요

## 환경 변수

다음 환경 변수들이 설정되어 있어야 합니다:

```bash
REACT_APP_API_BASE_URL=https://your-project.supabase.co/functions/v1/teamitaka-api
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 문제 해결

### 자주 발생하는 문제들

1. **401 Unauthorized**: Supabase API 키 확인
2. **500 Internal Server Error**: SendGrid 설정 확인
3. **네트워크 에러**: 인터넷 연결 및 CORS 설정 확인
4. **이메일 미수신**: SendGrid 발신자 이메일 인증 확인

### 디버깅 방법

1. **브라우저 개발자 도구** → **Console** 탭에서 로그 확인
2. **Network** 탭에서 API 요청/응답 확인
3. **Supabase 대시보드** → **Functions** → **Logs** 확인
