# 티미타카 AI 에이전트 테스트 시뮬레이션 가이드

## 개요

이 디렉토리는 **Claude/AI 에이전트**가 Playwright MCP를 통해 티미타카 앱의 기능을 자동으로 검증할 수 있는 테스트 시뮬레이션 프롬프트를 포함합니다.

## 파일 구조

```
src/tests/e2e/
├── ai-test-simulation.json              # 메인 테스트 설정 및 공통 정보
├── test-analysis-prompt.json            # 테스트 실패 분석 프롬프트
├── playwright-report-analysis-prompt.json # Playwright 리포트 페이지 분석 프롬프트
├── modules/
│   ├── m01-onboarding.json    # 온보딩 & 회원가입 (45개 테스트)
│   ├── m02-main.json          # 메인 화면 (18개 테스트)
│   ├── m03-notifications.json # 알림 (5개 테스트)
│   ├── m04-project.json       # 프로젝트 관리 (42개 테스트)
│   ├── m05-matching.json      # 팀매칭 (27개 테스트)
│   ├── m06-application.json   # 지원하기 & 지원자 관리 (28개 테스트)
│   ├── m07-evaluation.json    # 상호평가 & 별점관리 (30개 테스트)
│   ├── m08-profile.json       # 프로필 (27개 테스트)
│   ├── m09-bookmark.json      # 북마크 & 지원 내역 (11개 테스트)
│   └── m10-guest.json         # 비회원 유저 처리 (7개 테스트)
├── utils/
│   └── test-executor.ts       # 테스트 실행 유틸리티
├── test-runner.spec.ts        # Playwright 테스트 러너
└── README.md                  # 이 문서
```

## 총 테스트 케이스: 240+

## AI 에이전트 실행 방법

### 1. 사전 준비

```bash
# 앱 실행
cd /path/to/teamitakaFrontend2
npm start

# 앱이 http://localhost:3000 에서 실행 중인지 확인
```

### 2. Claude에게 테스트 실행 요청

다음 프롬프트를 Claude에게 전달하세요:

```
티미타카 앱 기능 검증을 위한 E2E 테스트를 실행해주세요.

테스트 설정 파일 위치: src/tests/e2e/ai-test-simulation.json

실행 조건:
- 앱 URL: http://localhost:3000
- 브라우저: Chromium
- 뷰포트: 390x844 (iPhone 14 Pro)

테스트할 모듈:
- [ ] M01: 온보딩 & 회원가입
- [ ] M02: 메인 화면
- [ ] M03: 알림
- [ ] M04: 프로젝트 관리
- [ ] M05: 팀매칭
- [ ] M06: 지원하기 & 지원자 관리
- [ ] M07: 상호평가 & 별점관리
- [ ] M08: 프로필
- [ ] M09: 북마크 & 지원 내역
- [ ] M10: 비회원 유저 처리

테스트 실행 후 결과를 마크다운 형식으로 리포트해주세요.
```

### 3. 특정 모듈만 테스트

```
M01 온보딩 모듈만 테스트해주세요.
설정 파일: src/tests/e2e/modules/m01-onboarding.json

사용자 상태: US01 (신규 유저)
```

### 4. 특정 사용자 상태로 테스트

```
US04 (회원/프로필 완료) 상태로 메인 화면 테스트를 실행해주세요.

설정:
- 인증 토큰: mock_token_full
- 진입점: /main
```

## 사용자 상태 (User States)

| ID | 이름 | 설명 | 진입점 |
|----|------|------|--------|
| US01 | 신규 유저 | 앱 최초 설치, 온보딩 미완료 | `/` |
| US02 | 비회원 | 회원가입 없이 둘러보기 | `/guest` |
| US03 | 회원 (프로필 X) | 회원가입 완료, 프로필 미입력 | `/profile-setup` |
| US04 | 회원 (프로필 O) | 정상 사용자 | `/main` |
| US05 | 재방문 유저 | 온보딩 완료 후 재방문 | `/main` |

## 테스트 액션 타입

| 액션 | 설명 | 예시 |
|------|------|------|
| `navigate` | 페이지 이동 | `{ "action": "navigate", "target": "/main" }` |
| `click` | 요소 클릭 | `{ "action": "click", "selector": ".btn" }` |
| `type` | 텍스트 입력 | `{ "action": "type", "selector": "input", "value": "test" }` |
| `wait` | 요소 대기 | `{ "action": "wait", "selector": ".modal", "timeout": 5000 }` |
| `screenshot` | 스크린샷 | `{ "action": "screenshot", "name": "test-result" }` |
| `scroll` | 스크롤 | `{ "action": "scroll", "direction": "down", "amount": 300 }` |
| `swipe` | 스와이프 | `{ "action": "swipe", "direction": "left" }` |

## 검증 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `element_visible` | 요소 표시 확인 | `{ "type": "element_visible", "selector": ".btn" }` |
| `element_hidden` | 요소 숨김 확인 | `{ "type": "element_hidden", "selector": ".modal" }` |
| `text_contains` | 텍스트 포함 | `{ "type": "text_contains", "selector": "h1", "expected": "안녕" }` |
| `url_contains` | URL 포함 | `{ "type": "url_contains", "expected": "/main" }` |
| `element_count` | 요소 개수 | `{ "type": "element_count", "selector": ".item", "expected": 5 }` |
| `input_value` | 입력값 확인 | `{ "type": "input_value", "selector": "input", "expected": "test" }` |

## 테스트 결과 리포트 형식

```markdown
# 티미타카 테스트 결과 리포트

## 실행 정보
- 실행 일시: 2025-12-20 10:30:00
- 총 테스트: 240건
- 통과: 235건 ✅
- 실패: 5건 ❌

## 모듈별 결과

### M01: 온보딩 & 회원가입
- 총 45건 중 44건 통과 (97.8%)
- ❌ M01-F02-03: 로그인 버튼 클릭 시 인증 실패
  - 원인: API 서버 응답 없음
  - 스크린샷: login-error.png

### M02: 메인 화면
- 총 18건 중 18건 통과 (100%)
- ✅ 모든 테스트 통과

...
```

## 셀렉터 참조

### 공통 컴포넌트
- 하단 네비게이션: `.bottom-nav`
- 알림 모달: `.alert-modal-container`
- 로딩 상태: `.loading-state`
- 토스트 메시지: `.toast-message`

### 페이지별 주요 셀렉터
- 로그인 버튼: `.login-button`
- 다음 버튼: `.next-button`
- 프로필 카드: `.profile-card`
- 프로젝트 카드: `.project-card`
- 매칭 카드: `.matching-card`

전체 셀렉터 목록은 `ai-test-simulation.json`의 `selectors` 섹션을 참조하세요.

## 테스트 데이터

### 유효한 사용자 데이터
```json
{
  "email": "test@hongik.ac.kr",
  "password": "Test1234!",
  "phone": "01012345678",
  "nickname": "테스트티미"
}
```

### 무효한 데이터 (오류 케이스 테스트용)
```json
{
  "invalid_email": "invalid@gmail.com",
  "weak_password": "1234",
  "wrong_verification_code": "000000"
}
```

## 테스트 실패 분석

테스트 실패 시 AI 에이전트에게 분석을 요청할 수 있습니다.

### 분석 프롬프트 파일
`src/tests/e2e/test-analysis-prompt.json`

### 분석 요청 방법

```
테스트 실패 결과를 분석해주세요.

분석 프롬프트: src/tests/e2e/test-analysis-prompt.json

실패한 테스트:
- ID: M02-F01-01
- 설명: 사용자명과 인사말이 표시되는가?
- 에러: Timeout waiting for selector '.user-greeting'
- 스크린샷: test-results/screenshots/M02-F01-01-failure.png

원인을 분석하고 개선 방안을 제시해주세요.
```

### 실패 패턴 분류

| 카테고리 | 설명 | 주요 증상 |
|---------|------|----------|
| AUTH | 인증 문제 | 로그인 화면 리다이렉트, 401 에러 |
| SELECTOR | 셀렉터 오류 | Timeout, Element not found |
| TIMING | 타이밍 문제 | Flaky test, 간헐적 실패 |
| NAVIGATION | 라우팅 문제 | URL 불일치, 리다이렉트 |
| API | API 문제 | 데이터 없음, 500 에러 |
| STATE | 상태 문제 | 이전 테스트 상태 오염 |

### 자동 수정 가능 항목
- 셀렉터 업데이트
- 타임아웃 증가
- 인증 상태 설정 추가
- wait 스텝 추가

## Playwright 리포트 페이지 분석

배포된 Playwright HTML 리포트 페이지를 분석할 수 있습니다.

### 리포트 분석 프롬프트 파일
`src/tests/e2e/playwright-report-analysis-prompt.json`

### 배포된 리포트 분석 요청

```
다음 Playwright 리포트를 분석해주세요.

리포트 URL: https://playwright-report-azure.vercel.app/

분석 프롬프트: src/tests/e2e/playwright-report-analysis-prompt.json

분석 요청사항:
1. 전체 테스트 결과 요약 (통과/실패/스킵 수)
2. 실패한 테스트 목록 추출
3. 각 실패 테스트의 에러 메시지 및 스크린샷 확인
4. 실패 원인 패턴별 분류
5. 우선순위별 개선 방안 제시
```

### 간편 분석 프롬프트

**전체 분석**
```
https://playwright-report-azure.vercel.app/ 이 Playwright 리포트를 전체 분석해주세요.
```

**실패 테스트만 분석**
```
https://playwright-report-azure.vercel.app/ 리포트에서 실패한 테스트만 분석해주세요.
```

**패턴별 그룹화**
```
https://playwright-report-azure.vercel.app/ 리포트의 실패 테스트들을 패턴별로 그룹화해주세요.
분류 기준: AUTH, SELECTOR, TIMING, NAVIGATION, API, STATE
```

### Playwright MCP 사용

Playwright MCP가 연결된 경우, AI가 직접 리포트 페이지에 접속하여 분석합니다:

1. 리포트 페이지 접속
2. 전체 요약 스크린샷 캡처
3. 실패 테스트 필터링 및 목록 확인
4. 각 실패 테스트 상세 정보 확인
5. 에러 메시지 및 스크린샷 분석

## 주의사항

1. **앱 실행 필수**: 테스트 전 `npm start`로 앱이 실행 중이어야 합니다.
2. **API 서버**: 백엔드 API 서버도 실행 중이어야 전체 플로우 테스트가 가능합니다.
3. **Mock 데이터**: 일부 테스트는 Mock 데이터를 사용하며, 실제 환경과 다를 수 있습니다.
4. **셀렉터 업데이트**: UI 변경 시 셀렉터가 변경될 수 있으므로 정기적으로 업데이트가 필요합니다.

## 문의

테스트 관련 문의사항은 프로젝트 담당자에게 연락하세요.
