import { Page } from '@playwright/test';

// 다중 테스트 계정 설정 (User State별)
export const TEST_USERS: Record<string, { email: string; password: string }> = {
  US04: {
    email: 'testuser1@korea.ac.kr',
    password: 'Test1234!'
  },
  US04_ALT: {
    email: 'testuser2@g.hongik.ac.kr',
    password: 'Test1234!'
  },
  US03: {
    email: 'testuser3@yonsei.ac.kr',
    password: 'Test1234!'
  },
  US05: {
    email: 'testuser4@snu.ac.kr',
    password: 'Test1234!'
  }
};

// 레거시 호환성 유지
export const TEST_USER = TEST_USERS.US04;

// 테스트 타임아웃 설정 (콜드 스타트 대응을 위해 증가)
export const TEST_TIMEOUTS = {
  navigation: 30000,  // 30초
  action: 10000,      // 10초
  login: 30000,       // 30초
  warmup: 60000,      // 60초
};

/**
 * 백엔드 서버 웜업 (Render 콜드 스타트 대응)
 * 무료 티어는 15분 비활성 후 슬립, 첫 요청에 30-60초 소요
 */
export async function warmupBackend(): Promise<boolean> {
  const apiBaseUrl = 'https://teamitakabackend.onrender.com';
  const maxAttempts = 5;
  const initialDelay = 5000; // 5초

  console.log('🔥 Warming up backend server (Render cold start)...');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiBaseUrl}/api/recruitments`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`✅ Backend ready (attempt ${attempt})`);
        return true;
      }

      console.log(`⚠️ Backend responded with status ${response.status}`);
    } catch (error: any) {
      const isAbort = error?.name === 'AbortError';
      console.log(`⏳ Warmup attempt ${attempt}/${maxAttempts} - ${isAbort ? 'timeout' : 'waiting for cold start'}...`);

      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, initialDelay * attempt));
      }
    }
  }

  console.warn('⚠️ Backend warmup failed after all attempts, proceeding anyway...');
  return false;
}

// 동적으로 가져온 테스트 데이터 (런타임에 설정됨)
export const TEST_DATA = {
  projectId: null as string | null,
  memberId: null as string | null,
  recruitmentId: null as string | null,
  applicationId: null as string | null,  // 테스트용 지원서 ID
};

// 테스트 데이터 설정 함수
export const setTestProjectId = (id: string) => { TEST_DATA.projectId = id; };
export const setTestMemberId = (id: string) => { TEST_DATA.memberId = id; };
export const setTestRecruitmentId = (id: string) => { TEST_DATA.recruitmentId = id; };
export const setTestApplicationId = (id: string) => { TEST_DATA.applicationId = id; };

/**
 * 테스트 시작 전 동적 테스트 데이터를 초기화합니다.
 * Guest 테스트에서도 recruitment ID를 사용할 수 있도록 미리 추출합니다.
 */
export async function initializeTestData(page: Page): Promise<void> {
  console.log('🔄 Initializing test data...');

  // 이미 recruitment ID가 있으면 스킵
  if (TEST_DATA.recruitmentId) {
    console.log(`ℹ️ Recruitment ID already set: ${TEST_DATA.recruitmentId}`);
    return;
  }

  try {
    // 방법 1: 공개 API를 통해 recruitment ID 가져오기
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const recruitmentId = await page.evaluate(async () => {
      try {
        // API 엔드포인트 (인증 불필요)
        const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL
          || 'https://teamitakabackend.onrender.com';

        const response = await fetch(`${apiBaseUrl}/api/recruitments`);

        if (response.ok) {
          const data = await response.json();

          // 배열 형태의 응답
          if (Array.isArray(data) && data.length > 0) {
            return String(data[0].recruitment_id || data[0].id);
          }

          // 객체 형태의 응답 (recruitments 필드)
          if (data.recruitments && data.recruitments.length > 0) {
            return String(data.recruitments[0].recruitment_id || data.recruitments[0].id);
          }
        }

        console.log('API response not ok or empty');
        return null;
      } catch (e) {
        console.error('Error fetching recruitments:', e);
        return null;
      }
    });

    if (recruitmentId) {
      setTestRecruitmentId(recruitmentId);
      console.log(`✅ Pre-extracted recruitment ID via API: ${recruitmentId}`);
      return;
    }

    // 방법 2: 팀매칭 페이지 DOM에서 추출
    await page.goto('/team-matching');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // 렌더링 대기

    const recruitmentLink = await page.locator('a[href*="/recruitment/"]').first();
    if (await recruitmentLink.count() > 0) {
      const href = await recruitmentLink.getAttribute('href');
      if (href) {
        const match = href.match(/\/recruitment\/([a-f0-9-]+|\d+)/i);
        if (match && match[1]) {
          setTestRecruitmentId(match[1]);
          console.log(`✅ Pre-extracted recruitment ID from DOM: ${match[1]}`);
          return;
        }
      }
    }

    console.warn('⚠️ Could not pre-extract recruitment ID');
  } catch (error) {
    console.error('❌ Failed to initialize test data:', error);
  }
}
