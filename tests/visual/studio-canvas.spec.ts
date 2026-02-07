import { test, expect } from '@playwright/test';

test('Studio Canvas Render - Golden Master', async ({ page }) => {

    // 1. Navigate to Studio
    await page.goto('/create');

    // 2. Wait for loader to disappear (it has a 5s fallback)
    await expect(page.locator('#studio-loader')).toBeHidden({ timeout: 15000 });

    // 3. Wait for canvas to be ready
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 3. Wait a bit for engine initialization (can be improved with event listeners later)
    await page.waitForTimeout(1000);

    // 4. Take screenshot of the canvas only
    await expect(canvas).toHaveScreenshot('studio-canvas-golden.png');
});
