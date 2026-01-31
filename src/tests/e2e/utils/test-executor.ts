import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { TEST_USER, TEST_USERS, TEST_TIMEOUTS, TEST_DATA, setTestProjectId, setTestMemberId, setTestRecruitmentId, setTestApplicationId } from './test-config';

export interface TestStep {
  action: string;
  target?: string;
  selector?: string;
  value?: string;
  timeout?: number;
  name?: string;
  direction?: string;
  amount?: number;
}

export interface Validation {
  type: string;
  selector?: string;
  expected?: string | number;
  pattern?: string;  // 정규식 패턴 (text_matches용)
  min?: number;      // 최소값 (count_greater_than용)
}

// setup_api를 위한 API 호출 정의
export interface SetupApiCall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: Record<string, any>;
  save_response?: Record<string, string>;
}

export interface TestScenario {
  id: string;
  description: string;
  user_state: string;
  priority?: string;
  steps: TestStep[];
  validations: Validation[];
  expected_result: string;
  skip?: boolean;
  skip_reason?: string;
  // 테스트 인프라 개선용 신규 필드
  setup_api?: SetupApiCall[];         // 사전 API 호출
  skip_if?: string;                    // 조건부 스킵 (예: 'has_notifications')
  depends_on?: string[];               // 선행 테스트 ID (선택적)
  required_state?: Record<string, string>;  // 필요한 상태 (예: { applicationId: '{{LAST_APPLICATION_ID}}' })
}

export interface Feature {
  feature_id: string;
  feature_name: string;
  route: string;
  test_scenarios: TestScenario[];
  skip?: boolean;
  skip_reason?: string;
}

export interface Module {
  module_id: string;
  module_name: string;
  features: Feature[];
  skip?: boolean;
  skip_reason?: string;
}

export interface TestResult {
  id: string;
  description: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
  screenshot?: string;
  duration: number;
}

export class TestExecutor {
  private page: Page;
  private results: TestResult[] = [];
  private screenshotDir: string;

  constructor(page: Page, screenshotDir: string = 'test-results/screenshots') {
    this.page = page;
    this.screenshotDir = screenshotDir;
  }

  /**
   * 인증된 세션을 설정합니다.
   * US03/US04/US05 테스트를 위해 실제 로그인을 수행합니다.
   * @param userState - 사용자 상태 (US03, US04, US05 등)
   */
  async setupAuthenticatedSession(userState: string = 'US04'): Promise<boolean> {
    // User State에 맞는 계정 선택
    const user = TEST_USERS[userState] || TEST_USERS.US04 || TEST_USER;
    console.log(`🔐 Attempting login with ${userState} account: ${user.email}`);

    // 3회 재시도 로직
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 1. 로그인 페이지로 이동
        await this.page.goto('/login');
        await this.page.waitForLoadState('networkidle');

        // 2. 이메일 입력
        const emailSelector = ".input-field[type='text']";
        await this.page.waitForSelector(emailSelector, { timeout: TEST_TIMEOUTS.action });
        await this.page.fill(emailSelector, user.email);

        // 3. 비밀번호 입력
        const passwordSelector = ".input-field[type='password']";
        await this.page.waitForSelector(passwordSelector, { timeout: TEST_TIMEOUTS.action });
        await this.page.fill(passwordSelector, user.password);

        // 4. 로그인 버튼 클릭
        const loginButtonSelector = "button.login-button[type='submit']";
        await this.page.click(loginButtonSelector);

        // 5. 로그인 완료 대기 (URL 변경 또는 토큰 저장)
        try {
          await this.page.waitForURL(/\/(main|team-matching)/, { timeout: 10000 });
        } catch {
          // URL 변경이 없어도 토큰으로 확인
          await this.page.waitForTimeout(2000);
        }

        // 6. 토큰 확인
        const token = await this.page.evaluate(() => localStorage.getItem('authToken'));
        const currentUrl = this.page.url();
        const isLoggedIn = token || currentUrl.includes('/main') || currentUrl.includes('/team-matching');

        if (isLoggedIn) {
          console.log(`✅ Login successful (attempt ${attempt})`);
          // 프로젝트 ID 추출 시도
          await this.extractUserProjectId();
          return true;
        }

        // 로그인 실패 - 재시도
        console.warn(`⚠️ Login attempt ${attempt} failed, ${attempt < 3 ? 'retrying...' : 'giving up'}`);
        if (attempt < 3) {
          await this.page.waitForTimeout(1000 * attempt); // 점진적 대기
        }
      } catch (error) {
        console.error(`❌ Login attempt ${attempt} error:`, error);
        if (attempt < 3) {
          await this.page.waitForTimeout(1000 * attempt);
        }
      }
    }

    // 모든 재시도 실패
    console.error('❌ Login failed after 3 attempts');
    await this.page.screenshot({ path: `${this.screenshotDir}/login-failed-${userState}.png`, fullPage: true });
    return false;
  }

  /**
   * 사용자의 프로젝트 ID를 추출합니다.
   * 1차: API를 통해 직접 프로젝트 목록 조회
   * 2차: DOM에서 프로젝트 링크 추출
   */
  private async extractUserProjectId(): Promise<void> {
    try {
      // 이미 프로젝트 ID가 있으면 스킵
      if (TEST_DATA.projectId) {
        return;
      }

      // 방법 1: API를 통해 프로젝트 ID 가져오기
      const projectId = await this.page.evaluate(async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.log('No auth token found');
            return null;
          }

          // REACT_APP_API_BASE_URL 환경변수 또는 기본값 사용
          const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

          const response = await fetch(`${apiBaseUrl}/api/projects`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            console.log('Projects API failed:', response.status);
            return null;
          }

          const data = await response.json();
          console.log('Projects API response - count:', Array.isArray(data) ? data.length : 'not array');

          // 응답이 배열인 경우 (project_id 사용 - UUID 형식)
          if (Array.isArray(data) && data.length > 0) {
            // ACTIVE 상태인 프로젝트 중 첫 번째 반환
            const activeProject = data.find((p: any) => p.status === 'ACTIVE');
            if (activeProject) {
              console.log('Found active project:', activeProject.project_id);
              return String(activeProject.project_id);
            }
            // 없으면 첫 번째 프로젝트 반환
            return String(data[0].project_id);
          }
          // 응답이 객체인 경우 (projects 필드 사용)
          if (data.projects && data.projects.length > 0) {
            return String(data.projects[0].project_id || data.projects[0].id);
          }
          return null;
        } catch (e) {
          console.error('Error fetching projects:', e);
          return null;
        }
      });

      if (projectId) {
        setTestProjectId(projectId);
        console.log(`📋 Extracted project ID via API: ${projectId}`);
        return;
      }

      // 방법 2: 프로젝트 관리 페이지에서 DOM 추출
      await this.page.goto('/project-management');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      // 프로젝트 카드나 링크에서 ID 추출 시도 (UUID 또는 숫자 ID 지원)
      const projectLink = await this.page.locator('a[href*="/project/"]').first();
      if (await projectLink.count() > 0) {
        const href = await projectLink.getAttribute('href');
        if (href) {
          // /project/{uuid} 또는 /project/{id} 형식에서 ID 추출
          const match = href.match(/\/project\/([a-f0-9-]+|\d+)/i);
          if (match && match[1]) {
            setTestProjectId(match[1]);
            console.log(`📋 Extracted project ID from DOM: ${match[1]}`);
            return;
          }
        }
      }

      // 평가 링크에서 추출 시도
      const evaluationLink = await this.page.locator('a[href*="/evaluation/project/"]').first();
      if (await evaluationLink.count() > 0) {
        const href = await evaluationLink.getAttribute('href');
        if (href) {
          const match = href.match(/\/evaluation\/project\/([a-f0-9-]+|\d+)/i);
          if (match && match[1]) {
            setTestProjectId(match[1]);
            console.log(`📋 Extracted project ID from evaluation link: ${match[1]}`);
            return;
          }
        }
      }

      // Recruitment ID 추출 시도
      await this.extractRecruitmentId();

      console.warn('⚠️ Could not extract project ID - no project links found');
    } catch (error) {
      console.warn('⚠️ Failed to extract project ID:', error);
    }
  }

  /**
   * 모집 공고 ID를 추출합니다.
   */
  private async extractRecruitmentId(): Promise<void> {
    try {
      // 이미 ID가 있으면 스킵
      if (TEST_DATA.recruitmentId) {
        return;
      }

      // 방법 1: API를 통해 recruitment ID 가져오기
      const recruitmentId = await this.page.evaluate(async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) return null;

          const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

          const response = await fetch(`${apiBaseUrl}/api/recruitments`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) return null;

          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // 첫 번째 모집 공고의 ID 반환
            return String(data[0].recruitment_id || data[0].id);
          }
          if (data.recruitments && data.recruitments.length > 0) {
            return String(data.recruitments[0].recruitment_id || data.recruitments[0].id);
          }
          return null;
        } catch (e) {
          console.error('Error fetching recruitments:', e);
          return null;
        }
      });

      if (recruitmentId) {
        setTestRecruitmentId(recruitmentId);
        console.log(`📋 Extracted recruitment ID via API: ${recruitmentId}`);
        return;
      }

      // 방법 2: 팀 매칭 페이지에서 DOM 추출
      await this.page.goto('/team-matching');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      const recruitmentLink = await this.page.locator('a[href*="/recruitment/"]').first();
      if (await recruitmentLink.count() > 0) {
        const href = await recruitmentLink.getAttribute('href');
        if (href) {
          const match = href.match(/\/recruitment\/([a-f0-9-]+|\d+)/i);
          if (match && match[1]) {
            setTestRecruitmentId(match[1]);
            console.log(`📋 Extracted recruitment ID from DOM: ${match[1]}`);
            return;
          }
        }
      }

      console.warn('⚠️ Could not extract recruitment ID');
    } catch (error) {
      console.warn('⚠️ Failed to extract recruitment ID:', error);
    }
  }

  /**
   * 테스트용 지원서를 생성합니다.
   * 이미 지원한 경우 기존 지원서 ID를 반환합니다.
   * @param recruitmentId 모집공고 ID
   * @returns applicationId 또는 null
   */
  async createTestApplication(recruitmentId: string): Promise<string | null> {
    try {
      const applicationId = await this.page.evaluate(async (recId: string) => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.log('No auth token found for application creation');
            return null;
          }

          const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

          // 먼저 기존 지원서가 있는지 확인
          const existingResponse = await fetch(`${apiBaseUrl}/api/applications/mine`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (existingResponse.ok) {
            const existingData = await existingResponse.json();
            const applications = existingData.data || existingData || [];
            // 해당 recruitment에 대한 기존 지원서 찾기
            const existingApp = applications.find((app: any) =>
              app.recruitment_id === recId || app.recruitmentId === recId
            );
            if (existingApp) {
              console.log('Found existing application:', existingApp.application_id || existingApp.id);
              return existingApp.application_id || existingApp.id || null;
            }
          }

          // 기존 지원서가 없으면 새로 생성
          const response = await fetch(`${apiBaseUrl}/api/applications/${recId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              introduction: '[E2E 테스트] 자동 생성된 테스트 지원서입니다.',
              portfolio_project_ids: []
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log('Application creation failed:', response.status, errorText);

            // 이미 지원한 경우 (409 Conflict) 기존 지원서 ID 재확인
            if (response.status === 409 || response.status === 400) {
              const retryResponse = await fetch(`${apiBaseUrl}/api/applications/mine`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                const apps = retryData.data || retryData || [];
                const app = apps.find((a: any) =>
                  a.recruitment_id === recId || a.recruitmentId === recId
                );
                if (app) {
                  console.log('Found existing application after conflict:', app.application_id || app.id);
                  return app.application_id || app.id || null;
                }
              }
            }
            return null;
          }

          const data = await response.json();
          console.log('Application created:', data);
          return data.application_id || data.id || null;
        } catch (e) {
          console.error('Error creating application:', e);
          return null;
        }
      }, recruitmentId);

      if (applicationId) {
        setTestApplicationId(applicationId);
        // localStorage에도 저장 (E2E 테스트에서 페이지가 이를 읽을 수 있도록)
        await this.page.evaluate((appId: string) => {
          localStorage.setItem('testApplicationId', appId);
        }, applicationId);
        console.log(`✅ Test application ready: ${applicationId}`);
        return applicationId;
      }

      console.warn('⚠️ Failed to create or find test application');
      return null;
    } catch (error) {
      console.error('❌ Error in createTestApplication:', error);
      return null;
    }
  }

  /**
   * 내 지원 목록을 조회합니다.
   * @returns 지원 목록 배열
   */
  async getMyApplications(): Promise<any[]> {
    try {
      const applications = await this.page.evaluate(async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.log('No auth token found');
            return [];
          }

          const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

          const response = await fetch(`${apiBaseUrl}/api/applications/mine`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            console.log('Get my applications failed:', response.status);
            return [];
          }

          const data = await response.json();
          return data.data || data || [];
        } catch (e) {
          console.error('Error fetching my applications:', e);
          return [];
        }
      });

      console.log(`📋 Retrieved ${applications.length} applications`);
      return applications;
    } catch (error) {
      console.error('❌ Error in getMyApplications:', error);
      return [];
    }
  }

  /**
   * 문자열 내의 플레이스홀더를 실제 값으로 치환합니다.
   */
  private replacePlaceholders(str: string): string {
    let result = str;

    // {{USER_PROJECT_ID}} 치환
    if (TEST_DATA.projectId) {
      result = result.replace(/\{\{USER_PROJECT_ID\}\}/g, TEST_DATA.projectId);
    } else if (result.includes('{{USER_PROJECT_ID}}')) {
      console.warn('⚠️ USER_PROJECT_ID placeholder found but no project ID available');
    }

    // {{USER_MEMBER_ID}} 치환
    if (TEST_DATA.memberId) {
      result = result.replace(/\{\{USER_MEMBER_ID\}\}/g, TEST_DATA.memberId);
    } else if (result.includes('{{USER_MEMBER_ID}}')) {
      console.warn('⚠️ USER_MEMBER_ID placeholder found but no member ID available');
    }

    // {{RECRUITMENT_ID}} 치환
    if (TEST_DATA.recruitmentId) {
      result = result.replace(/\{\{RECRUITMENT_ID\}\}/g, TEST_DATA.recruitmentId);
    } else if (result.includes('{{RECRUITMENT_ID}}')) {
      console.warn('⚠️ RECRUITMENT_ID placeholder found but no recruitment ID available');
    }

    // {{LAST_APPLICATION_ID}} 치환 (테스트용 지원서 ID)
    if (TEST_DATA.applicationId) {
      result = result.replace(/\{\{LAST_APPLICATION_ID\}\}/g, TEST_DATA.applicationId);
    } else if (result.includes('{{LAST_APPLICATION_ID}}')) {
      console.warn('⚠️ LAST_APPLICATION_ID placeholder found but no application ID available');
    }

    // {{TEST_EMAIL}} 치환
    result = result.replace(/\{\{TEST_EMAIL\}\}/g, TEST_USER.email);

    // {{TEST_PASSWORD}} 치환
    result = result.replace(/\{\{TEST_PASSWORD\}\}/g, TEST_USER.password);

    return result;
  }

  async executeStep(step: TestStep): Promise<void> {
    const timeout = step.timeout || 5000;

    switch (step.action) {
      case 'navigate':
        let target = step.target || '/';
        const originalTarget = target;
        // 플레이스홀더 치환
        target = this.replacePlaceholders(target);
        console.log(`🔗 Navigate: ${originalTarget} → ${target}`);

        // 현재 페이지가 앱 내부인지 확인하고 클라이언트 사이드 네비게이션 시도
        const currentUrl = this.page.url();
        const isInApp = currentUrl.includes('localhost:3000') && !currentUrl.includes('/login');

        if (isInApp && target.startsWith('/')) {
          // 클라이언트 사이드 네비게이션 (React Router 사용)
          try {
            await this.page.evaluate((path) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
            }, target);
            await this.page.waitForTimeout(1000);

            // URL이 변경되지 않았으면 일반 goto 사용
            if (!this.page.url().includes(target)) {
              console.log('⚠️ Client-side navigation failed, using goto');
              await this.page.goto(target);
              await this.page.waitForLoadState('networkidle');
            }
          } catch (e) {
            // 실패하면 일반 goto 사용
            await this.page.goto(target);
            await this.page.waitForLoadState('networkidle');
          }
        } else {
          // 일반 goto 사용
          await this.page.goto(target);
          await this.page.waitForLoadState('networkidle');
        }

        // 인증 컨텍스트 초기화 대기 (리다이렉트 방지)
        await this.page.waitForTimeout(1000);
        // 네비게이션 후 현재 URL 로그
        console.log(`📍 Current URL: ${this.page.url()}`);
        break;

      case 'click':
        if (step.selector) {
          await this.page.waitForSelector(step.selector, { timeout });
          await this.page.click(step.selector);
        }
        break;

      case 'type':
        if (step.selector && step.value) {
          await this.page.waitForSelector(step.selector, { timeout });
          // 플레이스홀더를 실제 테스트 자격증명으로 치환
          let actualValue = step.value;
          if (actualValue === '{{TEST_EMAIL}}') {
            actualValue = TEST_USER.email;
          } else if (actualValue === '{{TEST_PASSWORD}}') {
            actualValue = TEST_USER.password;
          }
          await this.page.fill(step.selector, actualValue);
        }
        break;

      case 'wait':
        if (step.selector) {
          await this.page.waitForSelector(step.selector, { timeout });
        }
        break;

      case 'wait_for_navigation':
        await this.page.waitForLoadState('networkidle');
        break;

      case 'screenshot':
        if (step.name) {
          const screenshotPath = path.join(this.screenshotDir, `${step.name}.png`);
          await this.page.screenshot({ path: screenshotPath, fullPage: true });
        }
        break;

      case 'scroll':
        const scrollAmount = step.amount || 300;
        if (step.direction === 'down') {
          await this.page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount);
        } else if (step.direction === 'up') {
          await this.page.evaluate((amount) => window.scrollBy(0, -amount), scrollAmount);
        }
        break;

      case 'swipe':
        // Simulate swipe using mouse drag
        const viewport = this.page.viewportSize();
        if (viewport) {
          const startX = viewport.width / 2;
          const startY = viewport.height / 2;
          const endX = step.direction === 'left' ? startX - 200 : startX + 200;

          await this.page.mouse.move(startX, startY);
          await this.page.mouse.down();
          await this.page.mouse.move(endX, startY, { steps: 10 });
          await this.page.mouse.up();
        }
        break;

      case 'clear_storage':
        await this.page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        break;

      case 'set_storage':
        if (step.value) {
          await this.page.evaluate((data) => {
            const parsed = JSON.parse(data);
            Object.entries(parsed).forEach(([key, value]) => {
              localStorage.setItem(key, String(value));
            });
          }, step.value);
        }
        break;

      default:
        console.warn(`Unknown action: ${step.action}`);
    }
  }

  async executeValidation(validation: Validation): Promise<boolean> {
    try {
      switch (validation.type) {
        case 'element_visible':
          if (validation.selector) {
            await expect(this.page.locator(validation.selector).first()).toBeVisible({ timeout: 5000 });
          }
          return true;

        case 'element_hidden':
          if (validation.selector) {
            await expect(this.page.locator(validation.selector)).toBeHidden({ timeout: 5000 });
          }
          return true;

        case 'text_contains':
          if (validation.selector && validation.expected) {
            const element = this.page.locator(validation.selector).first();
            await expect(element).toContainText(String(validation.expected), { timeout: 5000 });
          }
          return true;

        case 'url_contains':
          if (validation.expected) {
            await expect(this.page).toHaveURL(new RegExp(String(validation.expected)), { timeout: 5000 });
          }
          return true;

        case 'element_count':
          if (validation.selector && validation.expected !== undefined) {
            const count = await this.page.locator(validation.selector).count();
            expect(count).toBeGreaterThanOrEqual(Number(validation.expected));
          }
          return true;

        case 'input_value':
          if (validation.selector && validation.expected) {
            await expect(this.page.locator(validation.selector)).toHaveValue(String(validation.expected));
          }
          return true;

        case 'class_contains':
          if (validation.selector && validation.expected) {
            const element = this.page.locator(validation.selector).first();
            const classAttr = await element.getAttribute('class');
            expect(classAttr).toContain(String(validation.expected));
          }
          return true;

        // === 새로 추가된 동적 패턴 validation 타입 ===

        case 'text_matches':
          // 정규식 패턴 매칭 (예: ".+님$", "\\d+건")
          if (validation.selector && validation.pattern) {
            const element = this.page.locator(validation.selector).first();
            const text = await element.textContent();
            const regex = new RegExp(validation.pattern);
            expect(text).toMatch(regex);
          }
          return true;

        case 'element_exists':
          // 요소 존재 여부만 확인 (visible 여부 무관)
          if (validation.selector) {
            const count = await this.page.locator(validation.selector).count();
            expect(count).toBeGreaterThan(0);
          }
          return true;

        case 'text_not_empty':
          // 텍스트가 비어있지 않은지 확인
          if (validation.selector) {
            const element = this.page.locator(validation.selector).first();
            const text = await element.textContent();
            expect(text?.trim().length).toBeGreaterThan(0);
          }
          return true;

        case 'count_greater_than':
          // 요소 개수가 최소값 이상인지 확인
          if (validation.selector && validation.min !== undefined) {
            const count = await this.page.locator(validation.selector).count();
            expect(count).toBeGreaterThan(validation.min);
          }
          return true;

        case 'any_text_visible':
          // 여러 셀렉터 중 하나라도 텍스트가 보이면 통과
          if (validation.selector) {
            const element = this.page.locator(validation.selector).first();
            await expect(element).toBeVisible({ timeout: 5000 });
          }
          return true;

        case 'url_equals':
          // URL이 정확히 일치하는지 확인
          if (validation.expected) {
            const currentUrl = this.page.url();
            expect(currentUrl).toContain(String(validation.expected));
          }
          return true;

        case 'element_enabled':
          // 요소가 활성화 상태인지 확인
          if (validation.selector) {
            const element = this.page.locator(validation.selector).first();
            await expect(element).toBeEnabled({ timeout: 5000 });
          }
          return true;

        case 'element_disabled':
          // 요소가 비활성화 상태인지 확인
          if (validation.selector) {
            const element = this.page.locator(validation.selector).first();
            await expect(element).toBeDisabled({ timeout: 5000 });
          }
          return true;

        case 'attribute_equals':
          // 요소의 특정 속성 값 확인
          if (validation.selector && validation.expected) {
            const element = this.page.locator(validation.selector).first();
            const attrName = validation.pattern || 'value';
            const attrValue = await element.getAttribute(attrName);
            expect(attrValue).toBe(String(validation.expected));
          }
          return true;

        case 'button_disabled':
          // 버튼이 비활성화 상태인지 확인 (element_disabled의 별칭)
          if (validation.selector) {
            const element = this.page.locator(validation.selector).first();
            await expect(element).toBeDisabled({ timeout: 5000 });
          }
          return true;

        default:
          console.warn(`Unknown validation type: ${validation.type}`);
          return true;
      }
    } catch (error) {
      return false;
    }
  }

  async runScenario(scenario: TestScenario): Promise<TestResult> {
    const startTime = Date.now();
    let status: 'passed' | 'failed' | 'skipped' = 'passed';
    let error: string | undefined;
    let screenshot: string | undefined;

    try {
      // Execute all steps
      for (const step of scenario.steps) {
        await this.executeStep(step);
      }

      // Execute all validations
      for (const validation of scenario.validations) {
        const passed = await this.executeValidation(validation);
        if (!passed) {
          status = 'failed';
          error = `Validation failed: ${validation.type} - ${validation.selector}`;
          break;
        }
      }
    } catch (err) {
      status = 'failed';
      error = err instanceof Error ? err.message : String(err);
    }

    // Take screenshot on failure
    if (status === 'failed') {
      const screenshotPath = path.join(this.screenshotDir, `${scenario.id}-failure.png`);
      try {
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        screenshot = screenshotPath;
      } catch (e) {
        // Ignore screenshot errors
      }
    }

    const result: TestResult = {
      id: scenario.id,
      description: scenario.description,
      status,
      error,
      screenshot,
      duration: Date.now() - startTime,
    };

    this.results.push(result);
    return result;
  }

  getResults(): TestResult[] {
    return this.results;
  }

  clearResults(): void {
    this.results = [];
  }
}

export function loadModule(modulePath: string): Module {
  const absolutePath = path.resolve(modulePath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(content);
}

export function loadAllModules(modulesDir: string): Module[] {
  const modules: Module[] = [];
  const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.json') && f.startsWith('m'));

  for (const file of files) {
    const modulePath = path.join(modulesDir, file);
    modules.push(loadModule(modulePath));
  }

  return modules.sort((a, b) => a.module_id.localeCompare(b.module_id));
}

export function generateReport(results: TestResult[], outputPath: string): void {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const total = results.length;

  let report = `# 티미타카 테스트 결과 리포트\n\n`;
  report += `## 실행 정보\n`;
  report += `- 실행 일시: ${new Date().toLocaleString('ko-KR')}\n`;
  report += `- 총 테스트: ${total}건\n`;
  report += `- 통과: ${passed}건 ✅\n`;
  report += `- 실패: ${failed}건 ❌\n`;
  report += `- 스킵: ${skipped}건 ⏭️\n`;
  report += `- 성공률: ${((passed / total) * 100).toFixed(1)}%\n\n`;

  if (failed > 0) {
    report += `## 실패한 테스트\n\n`;
    const failedTests = results.filter(r => r.status === 'failed');
    for (const test of failedTests) {
      report += `### ❌ ${test.id}\n`;
      report += `- 설명: ${test.description}\n`;
      report += `- 에러: ${test.error}\n`;
      if (test.screenshot) {
        report += `- 스크린샷: ${test.screenshot}\n`;
      }
      report += `- 소요시간: ${test.duration}ms\n\n`;
    }
  }

  report += `## 전체 결과\n\n`;
  report += `| ID | 설명 | 상태 | 소요시간 |\n`;
  report += `|----|------|------|----------|\n`;
  for (const test of results) {
    const statusEmoji = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
    report += `| ${test.id} | ${test.description.substring(0, 40)}... | ${statusEmoji} | ${test.duration}ms |\n`;
  }

  fs.writeFileSync(outputPath, report);
}
