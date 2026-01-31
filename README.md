# TEAMITAKA

<div align="center">

![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**팀 프로젝트 매칭 플랫폼**

*대학생을 위한 스마트한 팀 빌딩 솔루션*

[시작하기](#-시작하기) • [기능](#-주요-기능) • [기술 스택](#-기술-스택) • [화면 구성](#-화면-구성)

</div>

---

## 📖 프로젝트 소개

**TEAMITAKA**는 팀 프로젝트를 함께할 팀원을 찾고 매칭해주는 모바일 애플리케이션입니다.

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
- 오늘의 TODO 리스트
- 추천 프로젝트 목록

### 📋 프로젝트 관리
- 진행 중/완료/전체 프로젝트 탭
- 프로젝트별 진행률 표시
- 팀원 현황 대시보드

### 📊 프로젝트 상세
- 퀵 액션 (팀원정보, 회의록, 캘린더)
- 프로젝트 진행 상황 (D-Day, 진행률)
- TODO 리스트 관리 (추가, 완료 토글)
- 팀원 활동 로그

### 📅 공유 캘린더
- 월별 달력 뷰
- 일정 목록 및 추가
- 날짜별 일정 표시

### 👥 팀원 정보
- 팀원 목록 및 역할 표시
- 담당 역할/업무 편집

### 🤝 팀매칭
- 프로젝트 탐색 및 검색
- 지원서 작성 및 제출
- 매칭 상태 확인

### 👤 프로필
- 개인 정보 관리
- 참여 프로젝트 이력
- 설정 및 로그아웃

### 📝 회의 관리
- 팀 회의록 작성
- 회의 제목 및 설명 입력
- 임시저장 글 불러오기

### 🔔 알림 설정
- 앱 알림 수신 ON/OFF
- 광고 수신 설정
- 세부 알림 (팀원 활동, 회의 일정, 마감, 지원자)

### ⭐ 평가 관리
- 완료된 프로젝트 별점 확인
- 팀원 평가지 조회
- 한 줄 요약 (좋았어요/아쉬웠어요)

### 🔖 북마크 (S05)
- 북마크한 프로젝트 목록
- 모집 중/마감 필터 탭
- 마감 임박 알림 배너
- 통계 바 (북마크 수, 지원 완료, 내 모집 글)

### 🧪 성향 테스트 (S10)
- 15문항 예/아니오 성향 테스트
- 팀플 성향 분석 결과
- 티미 유형 카드 (적응티미, 안정티미 등)
- 어울리는 유형 추천
- 카드 공유/저장

### 🔍 검색
- 프로젝트 제목/설명/태그 검색
- 최근 검색어 저장 (최대 10개)
- 인기 태그 (해시태그 빈도 기반)
- 검색 결과 목록 및 상세 정보

---

## 🛠 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Flutter | 3.x | 크로스 플랫폼 프레임워크 |
| Dart | 3.x | 프로그래밍 언어 |
| Provider | 6.x | 상태 관리 |

### Backend
| 기술 | 용도 |
|------|------|
| Node.js + Express | REST API 서버 |
| Supabase | PostgreSQL 데이터베이스 |
| Render | 클라우드 호스팅 |
| JWT | 인증 토큰 |

### Dependencies
```yaml
dependencies:
  flutter: sdk
  provider: ^6.1.5        # 상태 관리
  dio: ^5.9.0             # HTTP 클라이언트
  flutter_secure_storage: ^10.0.0  # 보안 저장소
  flutter_dotenv: ^5.2.1  # 환경 변수
  image_picker: ^1.2.1    # 이미지 선택
```

---

## 📁 프로젝트 구조

```
lib/
├── api/                    # API 통신
│   ├── api.dart            # 배럴 파일 (전체 export)
│   ├── auth_api.dart       # 인증 API
│   ├── application_api.dart # 지원 API
│   ├── comment_api.dart    # 댓글 API
│   ├── draft_api.dart      # 임시저장 API
│   ├── evaluation_api.dart # 평가 API
│   ├── notification_api.dart # 알림 API
│   ├── profile_api.dart    # 프로필 API
│   ├── project_api.dart    # 프로젝트 API
│   ├── recruitment_api.dart # 모집공고 API
│   ├── review_api.dart     # 리뷰 API
│   ├── schedule_api.dart   # 스케줄 API
│   ├── search_api.dart     # 검색 API
│   ├── type_test_api.dart  # 성격 테스트 API
│   └── vote_api.dart       # 투표 API
├── constants/              # 상수 정의
│   └── api.dart
├── providers/              # 전역 상태 관리
│   └── auth_provider.dart
├── theme/                  # 테마 및 스타일
│   ├── app_colors.dart
│   └── app_typography.dart
├── utils/                  # 유틸리티
│   └── responsive.dart     # 반응형 유틸리티
├── screens/                # 화면
│   ├── main_screen.dart
│   ├── splash_screen.dart  # S09 스플래시
│   ├── login_screen.dart   # S09 로그인
│   ├── bookmark_screen.dart # S05 북마크
│   ├── auth/               # 인증 화면
│   ├── home/               # 홈 화면
│   │   ├── home_screen.dart
│   │   └── widgets/
│   │       ├── home_header.dart
│   │       ├── project_card.dart
│   │       ├── project_section.dart
│   │       ├── recommended_section.dart
│   │       └── todo_section.dart
│   └── matching/           # 매칭 화면
├── features/               # 기능별 모듈
│   ├── profile/            # 프로필 관리
│   ├── project_management/ # 프로젝트 관리
│   │   └── presentation/
│   │       ├── providers/  # 프로젝트 상태 관리
│   │       └── screens/    # 상세/캘린더/멤버/회의록
│   ├── evaluation/         # 평가 기능
│   ├── apply/              # 지원 플로우
│   ├── kickoff/            # 킥오프 플로우
│   ├── meeting/            # 회의 관리 (S04)
│   ├── draft/              # 임시저장 (S06)
│   ├── notification/       # 알림 설정 (S07)
│   ├── rating/             # 평가 관리 (S11)
│   ├── analysis/           # 분석 결과 (S13)
│   ├── personality_test/   # 성향 테스트 (S10)
│   └── search/             # 검색 기능
├── widgets/                # 공통 위젯
│   ├── bottom_nav_bar.dart
│   ├── app_header.dart     # 공통 헤더
│   ├── app_toggle.dart     # 토글 스위치
│   ├── app_card.dart       # 카드 컴포넌트
│   ├── app_empty_state.dart # 빈 상태
│   ├── app_error_state.dart # 에러/로딩 상태
│   └── widgets.dart        # 배럴 파일
└── main.dart
```

---

## 📱 화면 구성

| 코드 | 화면 | 설명 | .pen ID |
|------|------|------|---------|
| - | **홈** | 프로젝트 현황, TODO, 추천 프로젝트 | - |
| - | **프로젝트 관리** | 내 프로젝트 목록 및 관리 | - |
| - | **프로젝트 상세** | 퀵액션, 진행상황, TODO, 활동로그 | - |
| - | **공유 캘린더** | 월별 달력, 일정 목록/추가 | - |
| - | **팀원 정보** | 팀원 목록, 역할/업무 편집 | - |
| - | **팀 회의록** | 월/일별 회의록 목록/생성 | - |
| - | **팀매칭** | 프로젝트 탐색 및 지원 | - |
| - | **프로필** | 개인 정보 및 설정 | - |
| S04 | **회의 생성** | 팀 회의록 작성 폼 | zcUEw |
| S05 | **북마크** | 북마크 프로젝트 목록/필터 | v5ewh |
| S06 | **임시저장** | 임시저장 글 불러오기/삭제 | d6qZd |
| S07 | **알림 설정** | 앱/광고/세부 알림 설정 | NtD3P |
| S09 | **스플래시/로그인** | 앱 시작 화면 및 로그인 | IuWrJ, M67ZB |
| S10 | **성향 테스트** | 15문항 예/아니오 테스트 | nB6hs |
| S11 | **평가 관리** | 완료 프로젝트 별점/평가지 | lb8ex |
| S13 | **분석 완료** | 성향테스트 결과 카드 | 1MJJR |

### 하단 네비게이션
```
[ 메인 ] [ 프로젝트 관리 ] [ 팀매칭 ] [ 프로필 ]
```

---

## 🚀 시작하기

### 사전 요구사항
- Flutter SDK 3.x 이상
- Dart SDK 3.x 이상
- Android Studio / VS Code
- Xcode (iOS 빌드 시)

### 설치

```bash
# 저장소 클론
git clone https://github.com/TeamKoHong/teamitaka-app.git

# 디렉토리 이동
cd teamitaka-app

# 의존성 설치
flutter pub get

# iOS 의존성 설치 (macOS)
cd ios && pod install && cd ..
```

### 환경 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```
API_BASE_URL=https://teamitakabackend.onrender.com/api
```

### 실행

```bash
# 개발 모드 실행
flutter run

# 특정 디바이스에서 실행
flutter run -d <device_id>

# 릴리즈 모드 빌드
flutter build apk --release  # Android
flutter build ios --release  # iOS
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
| 용도 | 색상 | HEX |
|------|------|-----|
| Primary | 🔴 | `#F76241` |
| Background | ⬜ | `#F2F2F2` |
| Surface | ⬜ | `#FFFFFF` |
| Text Primary | ⬛ | `#140805` |
| Text Secondary | 🔘 | `#807B79` |

### 폰트
| 폰트 | 용도 |
|------|------|
| KIMM_Bold | 로고, 강조 텍스트 |
| Pretendard | 본문 텍스트 |
| Inter | 숫자, 네비게이션 |

### 반응형 디자인
기준 사이즈: **390x844** (iPhone 14 Pro)

```dart
// 사용법
import 'package:teamitaka_app/utils/responsive.dart';

// Extension 사용
context.rw(16)   // 너비 기준 반응형 값
context.rsp(14)  // 반응형 폰트 사이즈

// 클래스 메서드 사용
Responsive.w(context, 16)
Responsive.padding(context, left: 16, right: 16)
Responsive.radius(context, 12)
```

---

## 🧪 테스트

```bash
# 전체 테스트 실행
flutter test

# 커버리지 리포트 생성
flutter test --coverage
```

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다.

---

## 📝 변경 이력

| 날짜 | 커밋 | 설명 |
|------|------|------|
| 2026-01-31 | `a3f607b` | 성격테스트 질문 화면 절대 위치 레이아웃 적용 |
| 2026-01-31 | `2dbaa4a` | 프로필 캐릭터 배너 클릭 시 성격테스트 화면 이동 연결 |
| 2026-01-31 | `636564f` | RatingProjectStatusScreen 추가 (프로젝트 평가 현황 화면) |
| 2026-01-31 | `7d87a6b` | TeamSelectScreen 추가 (지원자 관리 팀 선정 화면) |
| 2026-01-31 | `b786aad` | 디자인 토큰 React SCSS 동기화 (AppShadow 추가, 버튼 사이즈 variants) |
| 2026-01-31 | `f628111` | 프로필 API 연동 (getMe, getProfileDetail, 대학인증 SVG 배지) |
| 2026-01-30 | `2221c45` | 누락 API 연결 (스케줄, 투표, 성격테스트, 검색, 임시저장, 댓글) |
| 2026-01-30 | `4819af0` | 프로젝트 상세 화면 추가 (캘린더, 팀원정보, 회의록, 에러상태 위젯) |
| 2026-01-30 | `7b3a994` | 고우선순위 API 연동 (Upload, SMS, Recruitment, Application, Profile, Evaluation, Notification) |
| 2026-01-30 | `2b4c73e` | 백엔드 연동 API 인프라 구축 (ApiClient, AuthRepository, AuthProvider) |
| 2026-01-30 | `b80dd7f` | 팀원 상호평가 UI 개선 (슬라이더, 프로젝트카드, 카테고리명) |
| 2026-01-30 | `60b85ad` | 비밀번호 찾기 3단계 인증 플로우 추가 |
| 2026-01-30 | `12ffa98` | 검색 기능 추가 (제목/설명/태그 검색, 최근검색, 인기태그) |
| 2026-01-30 | `3a0bc6d` | S10 성향테스트 4축 스코어링 시스템 업데이트 |
| 2026-01-30 | `0725619` | 회의록(Proceedings) 목록/작성 API 연동 추가 |
| 2026-01-28 | `4804a77` | S05 북마크, S09 스플래시, S10 테스트 UI 추가 |
| 2026-01-28 | `2258b0a` | S13 분석완료 화면 추가 |
| 2026-01-28 | `4d5ff2c` | S11 평가관리 화면 추가 |
| 2026-01-28 | `33887b4` | S07 알림설정 화면 추가 |
| 2026-01-28 | `68d8bd5` | S06 임시저장 화면 추가 |
| 2026-01-28 | `dd69f2c` | 디자인 토큰, 공통 위젯, S04 회의 생성 화면 추가 |
| 2026-01-28 | `bd19ff7` | 모집 탭 만료 배너 UI 업데이트 |
| 2026-01-28 | `82820be` | 홈 화면 링 스타일 D-Day 인디케이터 추가 |
| 2026-01-28 | `2091dcf` | 프로젝트 UI 업데이트 (링 인디케이터, 헤더, 탭) |
| 2026-01-28 | `89d491e` | 프로젝트 관리 화면 실제 DB 연동 |
| 2026-01-28 | `4034d7c` | 헤더-탭바 간격 24px 추가 |
| 2026-01-28 | `abc10f7` | 프로젝트 관리 탭바/헤더/빈상태 Figma 스펙 완전 적용 |
| 2026-01-28 | `c781dfd` | 헤더 패딩 Figma 스펙 적용 |
| 2026-01-28 | `888389e` | 탭 바 Figma 스펙에 맞게 수정 (92px, 13px gap) |
| 2026-01-28 | `9f2ba9d` | 프로젝트 관리 화면 Figma 디자인 매칭 |
| 2026-01-28 | `ddf90e9` | 프로젝트 관리 메시지 배너 제거 |
| 2026-01-28 | `fd2cb9a` | 탭 바 컴포넌트 Figma 디자인 적용 |
| 2026-01-28 | `688c460` | README 변경 이력 테이블 추가 |
| 2026-01-28 | `7472f62` | 반응형 디자인 시스템 추가 (390x844 기준) |
| 2026-01-28 | `5a80124` | README 현재 기술 스택으로 업데이트 |
| 2026-01-28 | `73f0d04` | 홈 화면 Figma 디자인 적용, TODO 섹션 추가 |
| 2026-01-28 | `c6f6356` | 프로젝트 문서 README 추가 |
| 2026-01-28 | `df0c0b7` | 전체 기능 테스트 스위트 추가 |
| 2026-01-28 | `2ca6f93` | 킥오프 플로우 기능 추가 |
| 2026-01-28 | `64135d4` | 평가 및 레이팅 관리 기능 추가 |
| 2026-01-28 | `56335e4` | 지원 플로우 및 지원자 관리 기능 추가 |

---

## 👥 팀 정보

<div align="center">

### TEAMITAKA Development Team

| 역할 | 담당 |
|------|------|
| 📱 Mobile (Flutter) | TeamKoHong |
| 🎨 UI/UX Design | Figma |
| ☁️ Backend | Node.js + Supabase |

---

**Made with ❤️ by TEAMITAKA Team**

</div>
# teamitakaFrontend3
