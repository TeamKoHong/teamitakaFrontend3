import { Page, expect, Locator } from '@playwright/test';

/**
 * CSS Assertion Helpers for UI QA Testing
 * Provides reusable utilities for verifying CSS properties in Playwright tests
 */

/**
 * Assert exact CSS property value
 */
export async function assertCSSProperty(
    locator: Locator,
    property: string,
    expectedValue: string,
    description?: string
): Promise<void> {
    const message = description || `${property} should be ${expectedValue}`;
    await expect(locator, message).toHaveCSS(property, expectedValue);
}

/**
 * Assert margin property with shorthand support
 * Supports formats like "8px 0px" or "8px 0px 8px 0px"
 */
export async function assertMargin(
    locator: Locator,
    expectedMargin: string,
    description?: string
): Promise<void> {
    const message = description || `margin should be ${expectedMargin}`;

    // Normalize expected margin format
    const parts = expectedMargin.trim().split(/\s+/);

    if (parts.length === 2) {
        // "8px 0px" -> top/bottom left/right
        await expect(locator, `${message} (margin-top)`).toHaveCSS('margin-top', parts[0]);
        await expect(locator, `${message} (margin-bottom)`).toHaveCSS('margin-bottom', parts[0]);
        await expect(locator, `${message} (margin-left)`).toHaveCSS('margin-left', parts[1]);
        await expect(locator, `${message} (margin-right)`).toHaveCSS('margin-right', parts[1]);
    } else if (parts.length === 4) {
        // "8px 0px 8px 0px" -> top right bottom left
        await expect(locator, `${message} (margin-top)`).toHaveCSS('margin-top', parts[0]);
        await expect(locator, `${message} (margin-right)`).toHaveCSS('margin-right', parts[1]);
        await expect(locator, `${message} (margin-bottom)`).toHaveCSS('margin-bottom', parts[2]);
        await expect(locator, `${message} (margin-left)`).toHaveCSS('margin-left', parts[3]);
    } else {
        throw new Error(`Invalid margin format: ${expectedMargin}. Expected "8px 0px" or "8px 0px 8px 0px"`);
    }
}

/**
 * Assert specific margin side
 */
export async function assertMarginSide(
    locator: Locator,
    side: 'top' | 'right' | 'bottom' | 'left',
    expectedValue: string,
    description?: string
): Promise<void> {
    const property = `margin-${side}`;
    const message = description || `${property} should be ${expectedValue}`;
    await expect(locator, message).toHaveCSS(property, expectedValue);
}

/**
 * Assert gap property (for flexbox/grid)
 */
export async function assertGap(
    locator: Locator,
    expectedGap: string,
    description?: string
): Promise<void> {
    const message = description || `gap should be ${expectedGap}`;
    await expect(locator, message).toHaveCSS('gap', expectedGap);
}

/**
 * Assert text-align property
 */
export async function assertTextAlign(
    locator: Locator,
    expectedAlign: 'left' | 'center' | 'right' | 'justify',
    description?: string
): Promise<void> {
    const message = description || `text-align should be ${expectedAlign}`;
    await expect(locator, message).toHaveCSS('text-align', expectedAlign);
}

/**
 * Assert padding property with shorthand support
 */
export async function assertPadding(
    locator: Locator,
    expectedPadding: string,
    description?: string
): Promise<void> {
    const message = description || `padding should be ${expectedPadding}`;

    const parts = expectedPadding.trim().split(/\s+/);

    if (parts.length === 2) {
        await expect(locator, `${message} (padding-top)`).toHaveCSS('padding-top', parts[0]);
        await expect(locator, `${message} (padding-bottom)`).toHaveCSS('padding-bottom', parts[0]);
        await expect(locator, `${message} (padding-left)`).toHaveCSS('padding-left', parts[1]);
        await expect(locator, `${message} (padding-right)`).toHaveCSS('padding-right', parts[1]);
    } else if (parts.length === 4) {
        await expect(locator, `${message} (padding-top)`).toHaveCSS('padding-top', parts[0]);
        await expect(locator, `${message} (padding-right)`).toHaveCSS('padding-right', parts[1]);
        await expect(locator, `${message} (padding-bottom)`).toHaveCSS('padding-bottom', parts[2]);
        await expect(locator, `${message} (padding-left)`).toHaveCSS('padding-left', parts[3]);
    } else {
        throw new Error(`Invalid padding format: ${expectedPadding}`);
    }
}

/**
 * Check if element is horizontally centered
 * Uses bounding box to verify element is centered within its parent
 */
export async function assertHorizontallyCentered(
    page: Page,
    locator: Locator,
    description?: string
): Promise<void> {
    const message = description || 'element should be horizontally centered';

    const box = await locator.boundingBox();
    const viewport = page.viewportSize();

    if (!box || !viewport) {
        throw new Error('Could not get element bounding box or viewport size');
    }

    const elementCenter = box.x + box.width / 2;
    const viewportCenter = viewport.width / 2;
    const tolerance = 5; // 5px tolerance for centering

    const diff = Math.abs(elementCenter - viewportCenter);

    if (diff > tolerance) {
        throw new Error(
            `${message}: Element center (${elementCenter}px) is ${diff}px away from viewport center (${viewportCenter}px)`
        );
    }
}

/**
 * Assert display property (flex, block, none, etc.)
 */
export async function assertDisplay(
    locator: Locator,
    expectedDisplay: string,
    description?: string
): Promise<void> {
    const message = description || `display should be ${expectedDisplay}`;
    await expect(locator, message).toHaveCSS('display', expectedDisplay);
}

/**
 * Assert flex-direction property
 */
export async function assertFlexDirection(
    locator: Locator,
    expectedDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse',
    description?: string
): Promise<void> {
    const message = description || `flex-direction should be ${expectedDirection}`;
    await expect(locator, message).toHaveCSS('flex-direction', expectedDirection);
}

/**
 * Assert justify-content property
 */
export async function assertJustifyContent(
    locator: Locator,
    expectedValue: string,
    description?: string
): Promise<void> {
    const message = description || `justify-content should be ${expectedValue}`;
    await expect(locator, message).toHaveCSS('justify-content', expectedValue);
}

/**
 * Assert align-items property
 */
export async function assertAlignItems(
    locator: Locator,
    expectedValue: string,
    description?: string
): Promise<void> {
    const message = description || `align-items should be ${expectedValue}`;
    await expect(locator, message).toHaveCSS('align-items', expectedValue);
}
