import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import {
  TestExecutor,
  loadAllModules,
  generateReport,
  TestResult,
  Module,
  Feature,
  TestScenario,
} from './utils/test-executor';
import { initializeTestData, TEST_DATA, setTestApplicationId, warmupBackend } from './utils/test-config';

const MODULES_DIR = path.join(__dirname, 'modules');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-results', 'screenshots');
const REPORT_PATH = path.join(process.cwd(), 'test-report.md');

// Ensure directories exist
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Collect all test results
const allResults: TestResult[] = [];

// Load all modules
let modules: Module[] = [];
try {
  modules = loadAllModules(MODULES_DIR);
} catch (error) {
  console.error('Failed to load modules:', error);
}

// 테스트 시작 전 백엔드 웜업 및 동적 데이터 추출 (Guest 테스트용 recruitment ID 등)
test.beforeAll(async ({ browser }) => {
  console.log('🚀 Setting up test environment...');

  // Render 콜드 스타트 대응: 백엔드 웜업
  await warmupBackend();

  const page = await browser.newPage();
  try {
    await initializeTestData(page);
  } catch (error) {
    console.error('❌ Test data initialization failed:', error);
  } finally {
    await page.close();
  }

  console.log('✅ Test environment ready');
});

// Generate tests dynamically from JSON files
for (const module of modules) {
  // Skip entire module if marked
  if (module.skip) {
    test.describe.skip(`${module.module_id}: ${module.module_name} (${module.skip_reason || 'skipped'})`, () => {
      test('placeholder', () => {});
    });
    continue;
  }

  test.describe(`${module.module_id}: ${module.module_name}`, () => {
    for (const feature of module.features) {
      // Skip entire feature if marked
      if (feature.skip) {
        test.describe.skip(`${feature.feature_id}: ${feature.feature_name} (${feature.skip_reason || 'skipped'})`, () => {
          test('placeholder', () => {});
        });
        continue;
      }

      test.describe(`${feature.feature_id}: ${feature.feature_name}`, () => {
        for (const scenario of feature.test_scenarios) {
          // Skip scenarios with skip flag or low priority tests in CI
          const shouldSkip = scenario.skip || (scenario.priority === 'low' && process.env.CI);
          const testFn = shouldSkip ? test.skip : test;

          testFn(
            `${scenario.id}: ${scenario.description}`,
            async ({ page }) => {
              const executor = new TestExecutor(page, SCREENSHOTS_DIR);

              // Clear storage before each test for clean state
              await page.goto('/');
              await page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
              });

              // Set up user state if needed
              if (scenario.user_state === 'US02') {
                // Guest user - set onboarding complete
                await page.evaluate(() => {
                  localStorage.setItem('onboardingComplete', 'true');
                });
              } else if (['US03', 'US04', 'US05'].includes(scenario.user_state)) {
                // Logged in user - perform actual login with state-specific account
                const loginSuccess = await executor.setupAuthenticatedSession(scenario.user_state);
                if (!loginSuccess) {
                  console.log(`⏭️ Skipping ${scenario.id}: Login failed for ${scenario.user_state}`);
                  test.skip();
                  return;
                }
              }

              // 조건부 스킵 처리 (skip_if)
              if (scenario.skip_if) {
                const shouldSkip = await evaluateSkipCondition(page, scenario.skip_if);
                if (shouldSkip) {
                  console.log(`⏭️ Skipping ${scenario.id}: skip_if condition "${scenario.skip_if}" met`);
                  test.skip();
                  return;
                }
              }

              // 사전 API 호출 처리 (setup_api)
              if (scenario.setup_api && Array.isArray(scenario.setup_api) && scenario.setup_api.length > 0) {
                console.log(`🔧 Running setup_api for ${scenario.id}...`);
                for (const apiCall of scenario.setup_api) {
                  if (apiCall.endpoint.includes('/api/applications/') && apiCall.method === 'POST') {
                    // 지원서 생성 API 처리
                    const recruitmentId = TEST_DATA.recruitmentId;
                    if (!recruitmentId) {
                      console.warn(`⚠️ Cannot create application: No recruitment ID available`);
                      test.skip();
                      return;
                    }

                    const applicationId = await executor.createTestApplication(recruitmentId);
                    if (applicationId) {
                      setTestApplicationId(applicationId);
                      console.log(`✅ Setup API completed: Created application ${applicationId}`);
                    } else {
                      console.warn(`⚠️ Setup API failed: Could not create application`);
                      // 지원서 생성 실패 시에도 테스트 계속 진행 (이미 지원한 경우일 수 있음)
                    }
                  }
                }
              }

              // Execute the test scenario
              const result = await executor.runScenario(scenario);
              allResults.push(result);

              // Assert the test passed
              expect(result.status).toBe('passed');
            }
          );
        }
      });
    }
  });
}

// Helper function to determine if a test requires authentication
function requiresAuth(scenario: TestScenario): boolean {
  const authRequiredRoutes = [
    '/project-management',
    '/project/',
    '/profile',
    '/notifications',
    '/apply',
    '/evaluation',
    '/bookmark',
  ];

  for (const step of scenario.steps) {
    if (step.action === 'navigate' && step.target) {
      for (const route of authRequiredRoutes) {
        if (step.target.includes(route)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * skip_if 조건을 평가합니다.
 * @param page Playwright 페이지 객체
 * @param condition 스킵 조건 문자열
 * @returns 스킵해야 하면 true
 */
async function evaluateSkipCondition(page: any, condition: string): Promise<boolean> {
  try {
    switch (condition) {
      case 'has_notifications':
        // 알림이 있으면 true 반환 (빈 상태 테스트 스킵)
        const hasNotifications = await page.evaluate(async () => {
          try {
            const token = localStorage.getItem('authToken');
            if (!token) return false;

            const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';
            const response = await fetch(`${apiBaseUrl}/api/notifications?limit=1`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) return false;

            const data = await response.json();
            const count = data.data?.length || (Array.isArray(data) ? data.length : 0);
            return count > 0;
          } catch (e) {
            console.error('Error checking notifications:', e);
            return false;
          }
        });
        return hasNotifications;

      case 'no_applications':
        // 지원 내역이 없으면 true 반환
        const hasNoApplications = await page.evaluate(async () => {
          try {
            const token = localStorage.getItem('authToken');
            if (!token) return true;

            const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';
            const response = await fetch(`${apiBaseUrl}/api/applications/mine`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) return true;

            const data = await response.json();
            const count = data.data?.length || (Array.isArray(data) ? data.length : 0);
            return count === 0;
          } catch (e) {
            return true;
          }
        });
        return hasNoApplications;

      default:
        console.warn(`⚠️ Unknown skip condition: ${condition}`);
        return false;
    }
  } catch (error) {
    console.error(`❌ Error evaluating skip condition "${condition}":`, error);
    return false;
  }
}

// Generate report after all tests
test.afterAll(async () => {
  if (allResults.length > 0) {
    generateReport(allResults, REPORT_PATH);
    console.log(`\n📊 Test report generated: ${REPORT_PATH}`);
  }
});
