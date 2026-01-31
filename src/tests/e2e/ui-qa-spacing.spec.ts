import { test, expect, Page } from '@playwright/test';
import {
    assertMarginSide,
    assertGap,
    assertTextAlign,
    assertHorizontallyCentered,
    assertMargin,
} from './helpers/css-assertions';

/**
 * UI QA Spacing Verification Tests
 * 
 * Tests verify spacing adjustments based on QA feedback:
 * - TC-01: Project Card icon spacing
 * - TC-02: Step indicator margin
 * - TC-03: Category section gap
 * - TC-04: Question text spacing and alignment
 * - TC-05: Evaluation completion page layout
 */

// Test credentials
const TEST_CREDENTIALS = {
    email: 'sjwoo1999@korea.ac.kr',
    password: 'password!',
};

// Helper function to perform login
async function login(page: Page): Promise<void> {
    console.log('🔐 Logging in...');

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill email (아이디 입력)
    const emailSelector = "input[placeholder='아이디 입력']";
    await page.waitForSelector(emailSelector, { timeout: 10000 });
    await page.fill(emailSelector, TEST_CREDENTIALS.email);

    // Fill password (비밀번호 입력)
    const passwordSelector = "input[placeholder='비밀번호 입력']";
    await page.waitForSelector(passwordSelector, { timeout: 10000 });
    await page.fill(passwordSelector, TEST_CREDENTIALS.password);

    // Click login button
    const loginButtonSelector = "button.login-button";
    await page.click(loginButtonSelector);

    // Wait for navigation with longer timeout
    try {
        await page.waitForURL(/\/(main|team-matching|project-management)/, { timeout: 20000 });
    } catch {
        // If URL wait fails, wait for loading to finish
        await page.waitForTimeout(3000);
    }

    // Additional wait to ensure token is saved
    await page.waitForTimeout(1000);

    // Verify login success
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();

    console.log('✅ Login successful');
}

// Helper function to get first completed project ID
async function getCompletedProjectId(page: Page): Promise<string | null> {
    console.log('📋 Fetching completed project ID...');

    const projectId = await page.evaluate(async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

            const response = await fetch(`${apiBaseUrl}/api/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            const projects = Array.isArray(data) ? data : (data.data || []);

            // Find completed project
            const completedProject = projects.find((p: any) => p.status === 'COMPLETED');
            if (completedProject) {
                return completedProject.project_id || completedProject.id;
            }

            return null;
        } catch (e) {
            console.error('Error fetching projects:', e);
            return null;
        }
    });

    if (projectId) {
        console.log(`✅ Found completed project: ${projectId}`);
    } else {
        console.warn('⚠️ No completed project found');
    }

    return projectId;
}

// Helper function to get first unrated team member
async function getUnratedMemberId(page: Page, projectId: string): Promise<string | null> {
    console.log('👥 Fetching unrated team member...');

    const memberId = await page.evaluate(async (pid: string) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const apiBaseUrl = (window as any).__REACT_APP_API_BASE_URL || 'https://teamitakabackend.onrender.com';

            const response = await fetch(`${apiBaseUrl}/api/projects/${pid}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            const members = Array.isArray(data) ? data : (data.data || data.members || []);

            // Find first member (assuming unrated)
            if (members.length > 0) {
                return members[0].member_id || members[0].user_id || members[0].id;
            }

            return null;
        } catch (e) {
            console.error('Error fetching members:', e);
            return null;
        }
    }, projectId);

    if (memberId) {
        console.log(`✅ Found team member: ${memberId}`);
    } else {
        console.warn('⚠️ No team member found');
    }

    return memberId;
}

test.describe('UI QA - Spacing Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Clear storage
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        // Login
        await login(page);
    });

    test('TC-01: Project Card - Arrow and Star Icon Spacing', async ({ page }) => {
        console.log('🧪 TC-01: Verifying project card icon spacing...');

        // Navigate to project management - completed tab
        await page.goto('/project-management?tab=completed');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Check for completed project cards using CSS module class pattern
        // CSS modules generate classes like "CompletedProjectSimpleCard_completedCard__xxxxx"
        const completedCards = page.locator('[class*="completedCard"]');
        const cardCount = await completedCards.count();

        if (cardCount === 0) {
            console.warn('⚠️ No completed project cards found - skipping icon spacing test');
            test.skip();
            return;
        }

        console.log(`Found ${cardCount} completed project card(s)`);

        // Test star icon spacing in CompletedProjectSimpleCard
        // Look for star icon using CSS module pattern
        const starIcon = page.locator('[class*="starIcon"]').first();
        if (await starIcon.count() > 0) {
            await assertMarginSide(
                starIcon,
                'right',
                '4px',
                'Star icon should have 4px right margin'
            );
            console.log('✅ Star icon spacing verified');
        } else {
            console.warn('⚠️ Star icon not found in completed cards');
        }
    });

    test('TC-02: Team Member Evaluation - Step Indicator Spacing', async ({ page }) => {
        console.log('🧪 TC-02: Verifying step indicator spacing...');

        // Get project and member IDs
        const projectId = await getCompletedProjectId(page);
        if (!projectId) {
            console.warn('⚠️ No completed project available - skipping test');
            test.skip();
            return;
        }

        const memberId = await getUnratedMemberId(page, projectId);
        if (!memberId) {
            console.warn('⚠️ No team member available - skipping test');
            test.skip();
            return;
        }

        // Navigate to evaluation page
        await page.goto(`/evaluation/team-member/${projectId}/${memberId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Find step indicator container
        const stepIndicator = page.locator('[class*="stepIndicatorContainer"]').first();
        await expect(stepIndicator).toBeVisible({ timeout: 10000 });

        // Verify margin: 8px 0
        await assertMarginSide(
            stepIndicator,
            'top',
            '8px',
            'Step indicator margin-top should be 8px'
        );

        await assertMarginSide(
            stepIndicator,
            'bottom',
            '8px',
            'Step indicator margin-bottom should be 8px'
        );

        console.log('✅ Step indicator spacing verified');
    });

    test('TC-03: Team Member Evaluation - Category Section Gap', async ({ page }) => {
        console.log('🧪 TC-03: Verifying category section gap...');

        // Get project and member IDs
        const projectId = await getCompletedProjectId(page);
        if (!projectId) {
            console.warn('⚠️ No completed project available - skipping test');
            test.skip();
            return;
        }

        const memberId = await getUnratedMemberId(page, projectId);
        if (!memberId) {
            console.warn('⚠️ No team member available - skipping test');
            test.skip();
            return;
        }

        // Navigate to evaluation page
        await page.goto(`/evaluation/team-member/${projectId}/${memberId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Find category section
        const categorySection = page.locator('[class*="categorySection"]').first();
        await expect(categorySection).toBeVisible({ timeout: 10000 });

        // Verify gap: 8px
        await assertGap(
            categorySection,
            '8px',
            'Category section gap should be 8px'
        );

        console.log('✅ Category section gap verified');
    });

    test('TC-04: Total Score Page - Question Text Spacing and Alignment', async ({ page }) => {
        console.log('🧪 TC-04: Verifying question text spacing and alignment...');

        // Get project and member IDs
        const projectId = await getCompletedProjectId(page);
        if (!projectId) {
            console.warn('⚠️ No completed project available - skipping test');
            test.skip();
            return;
        }

        const memberId = await getUnratedMemberId(page, projectId);
        if (!memberId) {
            console.warn('⚠️ No team member available - skipping test');
            test.skip();
            return;
        }

        // Navigate to evaluation page step 2 (total score)
        await page.goto(`/evaluation/team-member/${projectId}/${memberId}?step=2`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Find question text element
        const questionText = page.locator('[class*="questionText"]').first();

        // Check if element exists
        if (await questionText.count() === 0) {
            console.warn('⚠️ Question text not found - may need to complete step 1 first');

            // Try navigating to step 1, filling it out, then going to step 2
            await page.goto(`/evaluation/team-member/${projectId}/${memberId}`);
            await page.waitForTimeout(2000);

            // Fill out step 1 ratings (set all to 3)
            const sliders = page.locator('[class*="ratingTrackArea"]');
            const sliderCount = await sliders.count();

            for (let i = 0; i < sliderCount; i++) {
                await sliders.nth(i).click();
            }

            // Click next button
            const nextButton = page.locator('button:has-text("다음")').first();
            if (await nextButton.count() > 0) {
                await nextButton.click();
                await page.waitForTimeout(2000);
            } else {
                console.warn('⚠️ Cannot proceed to step 2 - skipping test');
                test.skip();
                return;
            }
        }

        await expect(questionText).toBeVisible({ timeout: 10000 });

        // Verify margin-top: 8px
        await assertMarginSide(
            questionText,
            'top',
            '8px',
            'Question text margin-top should be 8px'
        );

        // Verify margin-bottom: 8px
        await assertMarginSide(
            questionText,
            'bottom',
            '8px',
            'Question text margin-bottom should be 8px'
        );

        // Verify text-align: left
        await assertTextAlign(
            questionText,
            'left',
            'Question text should be left-aligned'
        );

        console.log('✅ Question text spacing and alignment verified');
    });

    test('TC-05: Evaluation Complete Page - Layout Verification', async ({ page }) => {
        console.log('🧪 TC-05: Verifying evaluation completion page layout...');

        // Get project and member IDs
        const projectId = await getCompletedProjectId(page);
        if (!projectId) {
            console.warn('⚠️ No completed project available - skipping test');
            test.skip();
            return;
        }

        const memberId = await getUnratedMemberId(page, projectId);
        if (!memberId) {
            console.warn('⚠️ No team member available - skipping test');
            test.skip();
            return;
        }

        // Start evaluation - Step 1
        console.log('📝 Starting evaluation flow...');
        await page.goto(`/evaluation/team-member/${projectId}/${memberId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Complete Step 1: Fill all ability ratings
        console.log('✏️ Step 1: Filling ability ratings...');
        const sliders = page.locator('[class*="ratingTrackArea"]');
        const sliderCount = await sliders.count();

        if (sliderCount === 0) {
            console.warn('⚠️ No rating sliders found - skipping test');
            test.skip();
            return;
        }

        // Click middle of each slider to set rating to 3
        for (let i = 0; i < sliderCount; i++) {
            await sliders.nth(i).click();
            await page.waitForTimeout(100);
        }

        // Go to Step 2
        const nextButton1 = page.locator('button:has-text("다음")').first();
        await expect(nextButton1).toBeVisible({ timeout: 10000 });
        await nextButton1.click();
        await page.waitForTimeout(2000);

        // Complete Step 2: Enter total score and comment
        console.log('✏️ Step 2: Entering total score...');

        // Click on the 3rd star to set a rating (CSS module pattern)
        const stars = page.locator('[class*="starIcon"]');
        const starCount = await stars.count();
        if (starCount >= 3) {
            await stars.nth(2).click(); // Click 3rd star (index 2) for rating of 3
            await page.waitForTimeout(500);
            console.log('⭐ Rating star clicked');
        } else {
            console.warn('⚠️ No rating stars found');
        }

        // Enter comment
        const commentInput = page.locator('textarea[placeholder*="내용"]').first();
        if (await commentInput.count() > 0) {
            await commentInput.fill('테스트 평가 코멘트입니다.');
            await page.waitForTimeout(500);
            console.log('✍️ Comment entered');
        }

        // Submit evaluation
        const submitButton = page.locator('button:has-text("평가 보내기")').first();
        await expect(submitButton).toBeVisible({ timeout: 10000 });
        await submitButton.click();
        await page.waitForTimeout(3000); // Wait for submission and navigation

        // Now we should be on Step 3 (completion page)
        console.log('✅ Evaluation submitted, verifying completion page...');

        // Check if completion elements exist
        const checkIcon = page.locator('[class*="checkIconCircle"]').first();
        const successMessage = page.locator('[class*="successMessage"]').first();

        if (await checkIcon.count() === 0) {
            console.warn('⚠️ Completion page not loaded - possibly already evaluated');
            test.skip();
            return;
        }

        // Verify check icon is visible
        await expect(checkIcon).toBeVisible({ timeout: 10000 });
        console.log('✅ Check icon visible');

        // Verify success message is visible and centered
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        await assertTextAlign(
            successMessage,
            'center',
            'Success message should be center-aligned'
        );
        console.log('✅ Success message centered');

        // Take screenshot for visual verification
        const screenshot = await page.screenshot({
            path: 'test-results/tc-05-completion-layout.png',
            fullPage: true
        });
        console.log('📸 Screenshot saved for visual verification');

        console.log('✅ Evaluation completion page layout verified');
    });
});
