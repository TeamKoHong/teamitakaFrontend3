# TEAMITAKA

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-6.0-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)

**팀 프로젝트 매칭 플랫폼**

*대학생을 위한 스마트한 팀 빌딩 솔루션*

[시작하기](#-시작하기) • [기능](#-주요-기능) • [기술 스택](#-기술-스택)

</div>

---

## 📖 프로젝트 소개

**TEAMITAKA**는 팀 프로젝트를 함께할 팀원을 찾고 매칭해주는 하이브리드 모바일 애플리케이션입니다.

### 목적
- 효율적인 **팀원 모집 및 지원 관리**
- 프로젝트 **킥오프부터 완료까지** 체계적인 관리
- **TODO 관리**를 통한 프로젝트 진행 상황 추적

### 대상 사용자
| 사용자 | 활용 사례 |
|--------|----------|
| 🎓 **대학생** | 수업 팀 프로젝트, 공모전, 스터디 그룹 |
| 💼 **직장인** | 사이드 프로젝트, 스타트업 팀 빌딩 |
| 🚀 **창업 준비생** | 공동 창업자 탐색, MVP 개발 팀 구성 |

---

## ✨ 주요 기능

### 🏠 홈 화면
- 사용자 프로필 요약 (대학교, 학과, 키워드)
- 참여 중인 프로젝트 현황 (가로 스크롤)
- Pull to Refresh 지원

### 📋 프로젝트 관리
- 진행 중/완료/전체 프로젝트 탭
- 프로젝트별 진행률 표시
- 팀원 현황 대시보드

### 📊 프로젝트 상세
- 퀵 액션 (팀원정보, 회의록, 캘린더)
- 프로젝트 진행 상황 (D-Day, 진행률)
- TODO 리스트 관리

### 🤝 팀매칭
- 프로젝트 탐색 및 검색
- 지원서 작성 및 제출
- 매칭 상태 확인

### 👤 프로필
- 개인 정보 관리
- 참여 프로젝트 이력
- 대학 인증

### 🧪 성향 테스트
- 15문항 예/아니오 성향 테스트
- 팀플 성향 분석 결과
- 티미 유형 카드

### 📱 네이티브 기능
- 햅틱 피드백 (터치 반응)
- iOS 스타일 UI 컴포넌트
- 푸시 알림
- Safe Area 지원

---

## 🛠 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2 | UI 프레임워크 |
| Capacitor | 6.0 | 네이티브 브릿지 |
| Redux Toolkit | 2.x | 상태 관리 |
| React Router | 7.x | 라우팅 |
| SASS | 1.x | 스타일링 |
| Axios | 1.x | HTTP 클라이언트 |

### Native Plugins
| 플러그인 | 용도 |
|----------|------|
| @capacitor/haptics | 햅틱 피드백 |
| @capacitor/keyboard | 키보드 제어 |
| @capacitor/status-bar | 상태바 스타일링 |
| @capacitor/splash-screen | 스플래시 화면 |
| @capacitor/push-notifications | 푸시 알림 |
| @capacitor/app | 앱 상태 관리 |

### Backend
| 기술 | 용도 |
|------|------|
| Node.js + Express | REST API 서버 |
| Supabase | PostgreSQL 데이터베이스 |
| Firebase | 푸시 알림 |
| Render | 클라우드 호스팅 |

---

## 📁 프로젝트 구조

```
src/
├── assets/                 # 이미지, 아이콘
├── components/             # 공통 컴포넌트
│   ├── Common/             # 공통 UI 컴포넌트
│   │   ├── BottomNav/      # 하단 네비게이션
│   │   ├── NativeButton.js # iOS 스타일 버튼
│   │   ├── NativeHeader.js # iOS 스타일 헤더
│   │   ├── PullToRefresh.js # 당겨서 새로고침
│   │   ├── PageTransition.js # 페이지 전환 애니메이션
│   │   └── CollapsibleHeader.js # iOS Large Title 헤더
│   └── Home/               # 홈 화면 컴포넌트
├── contexts/               # React Context
│   ├── AuthContext.js      # 인증 상태
│   └── UniversityFilterContext.js
├── features/               # 기능별 모듈
│   └── type-test/          # 성향 테스트
├── hooks/                  # 커스텀 훅
│   └── useNativeApp.js     # 네이티브 기능 훅
├── pages/                  # 페이지 컴포넌트
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── Profile/
│   ├── ProjectManagement/
│   ├── NotificationsPage/
│   └── ...
├── services/               # API 서비스
│   ├── api.js              # API 클라이언트
│   ├── user.js             # 사용자 API
│   ├── projects.js         # 프로젝트 API
│   └── ...
├── store/                  # Redux Store
├── constants/              # 상수 정의
├── App.js                  # 앱 엔트리
└── App.css                 # 글로벌 스타일

ios/                        # iOS 네이티브 프로젝트
android/                    # Android 네이티브 프로젝트
capacitor.config.ts         # Capacitor 설정
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.x 이상
- npm 9.x 이상
- Xcode 15+ (iOS 빌드 시)
- Android Studio (Android 빌드 시)

### 설치

```bash
# 저장소 클론
git clone https://github.com/TeamKoHong/teamitakaFrontend3.git

# 디렉토리 이동
cd teamitakaFrontend3

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 웹 개발 서버 실행
npm start
```

### 모바일 빌드 및 실행

```bash
# 프로덕션 빌드
npm run build

# Capacitor 동기화
npx cap sync

# iOS 실행
npx cap open ios

# Android 실행
npx cap open android
```

### 빠른 빌드 (build + sync)

```bash
npm run cap:build
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
| 용도 | 색상 | HEX |
|------|------|-----|
| Primary | 🔴 | `#F76241` |
| iOS Blue | 🔵 | `#007AFF` |
| Background | ⬜ | `#F2F2F7` |
| Surface | ⬜ | `#FFFFFF` |
| Text Primary | ⬛ | `#140805` |
| Text Secondary | 🔘 | `#807B79` |

### 폰트
| 폰트 | 용도 |
|------|------|
| SF Pro Display | iOS 시스템 폰트 |
| Pretendard | 본문 텍스트 |

### iOS 네이티브 스타일
- Safe Area Inset 적용
- 시스템 폰트 사용 (-apple-system)
- 햅틱 피드백 지원
- iOS 스타일 네비게이션

---

## 📱 네이티브 컴포넌트 사용법

### useNativeApp Hook

```jsx
import { useNativeApp } from './hooks/useNativeApp';

const MyComponent = () => {
  const { hapticFeedback, hapticNotification } = useNativeApp();

  const handlePress = async () => {
    await hapticFeedback('medium'); // light, medium, heavy
  };

  const handleSuccess = async () => {
    await hapticNotification('success'); // success, warning, error
  };
};
```

### NativeButton

```jsx
import NativeButton from './components/Common/NativeButton';

<NativeButton
  variant="primary"  // primary, secondary, danger, ghost
  size="medium"      // small, medium, large
  haptic="medium"    // light, medium, heavy
  onClick={handleClick}
>
  버튼 텍스트
</NativeButton>
```

### PullToRefresh

```jsx
import PullToRefresh from './components/Common/PullToRefresh';

<PullToRefresh onRefresh={handleRefresh}>
  <YourContent />
</PullToRefresh>
```

---

## 🧪 테스트

```bash
# 유닛 테스트
npm test

# E2E 테스트 (Playwright)
npm run test:e2e

# E2E 테스트 UI 모드
npm run test:e2e:ui
```

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다.

---

## 👥 팀 정보

<div align="center">

### TEAMITAKA Development Team

| 역할 | 담당 |
|------|------|
| 📱 Frontend (React) | TeamKoHong |
| 🎨 UI/UX Design | Figma |
| ☁️ Backend | Node.js + Supabase |

---

**Made with ❤️ by TEAMITAKA Team**

</div>
