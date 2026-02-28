import { test, expect } from '@playwright/test';
import { singleFingerDrag } from './helpers/touch';
import { waitForGraphReady } from './helpers/graph';

test.describe('Zone lock / unlock feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGraphReady(page);
  });

  // ── Toolbar visibility ──────────────────────────────────

  test('zone lock toggle is visible in zone mode (default)', async ({ page }) => {
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await expect(zoneLockBtn).toBeVisible();
  });

  test('node lock toggle is visible in zone mode', async ({ page }) => {
    const nodeLockBtn = page.getByTestId('node-lock-toggle');
    await expect(nodeLockBtn).toBeVisible();
  });

  test('lock toggles are hidden in explorer mode', async ({ page }) => {
    // Switch to explorer mode
    const viewToggle = page.locator('.view-toggle-btn');
    await viewToggle.click();
    await page.waitForTimeout(400);

    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await expect(zoneLockBtn).not.toBeVisible();

    const nodeLockBtn = page.getByTestId('node-lock-toggle');
    await expect(nodeLockBtn).not.toBeVisible();
  });

  // ── Zone lock toggle appearance ─────────────────────────

  test('zone lock button shows locked state by default', async ({ page }) => {
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await expect(zoneLockBtn).toHaveClass(/locked/);
  });

  test('clicking zone lock toggle changes its state', async ({ page }) => {
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await expect(zoneLockBtn).toHaveClass(/locked/);

    await zoneLockBtn.click();
    await expect(zoneLockBtn).not.toHaveClass(/locked/);

    await zoneLockBtn.click();
    await expect(zoneLockBtn).toHaveClass(/locked/);
  });

  // ── Node lock toggle appearance ─────────────────────────

  test('node lock button shows unlocked state by default', async ({ page }) => {
    const nodeLockBtn = page.getByTestId('node-lock-toggle');
    await expect(nodeLockBtn).not.toHaveClass(/locked/);
  });

  test('clicking node lock toggle changes its state', async ({ page }) => {
    const nodeLockBtn = page.getByTestId('node-lock-toggle');
    await expect(nodeLockBtn).not.toHaveClass(/locked/);

    await nodeLockBtn.click();
    await expect(nodeLockBtn).toHaveClass(/locked/);

    await nodeLockBtn.click();
    await expect(nodeLockBtn).not.toHaveClass(/locked/);
  });

  // ── Zone draggability ───────────────────────────────────

  test('locked zones cannot be dragged', async ({ page }) => {
    const zone = page.locator('.react-flow__node-zoneContainer').first();
    await zone.waitFor({ state: 'visible' });

    // Read the node's flow-coordinate transform (not screen bounding box,
    // which shifts when the viewport pans)
    const getNodeTransform = () =>
      zone.evaluate((el) => {
        const style = el.getAttribute('style') ?? '';
        const m = style.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (!m) throw new Error(`Cannot parse node transform: ${style}`);
        return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
      });

    const before = await getNodeTransform();
    const box = await zone.boundingBox();
    expect(box).toBeTruthy();

    const from = {
      x: box!.x + box!.width / 2,
      y: box!.y + 20,
    };
    const to = { x: from.x + 100, y: from.y + 80 };

    await singleFingerDrag(page, from, to, 10);
    await page.waitForTimeout(300);

    const after = await getNodeTransform();

    // Zone's flow-coordinate position should NOT have changed
    const dx = Math.abs(after.x - before.x);
    const dy = Math.abs(after.y - before.y);
    expect(dx + dy).toBeLessThan(1);
  });

  test('unlocked zones can be dragged', async ({ page }) => {
    // Unlock zones
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await zoneLockBtn.click();

    const zone = page.locator('.react-flow__node-zoneContainer').first();
    await zone.waitFor({ state: 'visible' });
    const beforeBox = await zone.boundingBox();
    expect(beforeBox).toBeTruthy();

    const from = {
      x: beforeBox!.x + beforeBox!.width / 2,
      y: beforeBox!.y + 20,
    };
    const to = { x: from.x + 100, y: from.y + 80 };

    await singleFingerDrag(page, from, to, 10);
    await page.waitForTimeout(300);

    const afterBox = await zone.boundingBox();
    expect(afterBox).toBeTruthy();

    // Zone should have moved meaningfully
    const dx = Math.abs(afterBox!.x - beforeBox!.x);
    const dy = Math.abs(afterBox!.y - beforeBox!.y);
    expect(dx + dy).toBeGreaterThan(30);
  });

  // ── Node lock independent of zone lock ──────────────────

  test('locking nodes does not affect zone lock state', async ({ page }) => {
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    const nodeLockBtn = page.getByTestId('node-lock-toggle');

    // Lock nodes
    await nodeLockBtn.click();
    await expect(nodeLockBtn).toHaveClass(/locked/);

    // Zones should still be locked (unchanged)
    await expect(zoneLockBtn).toHaveClass(/locked/);
  });

  // ── Reset button ────────────────────────────────────────

  test('reset button appears after dragging and clears position', async ({ page }) => {
    // Reset button should not be visible initially
    const resetBtn = page.getByTestId('reset-positions');
    await expect(resetBtn).not.toBeVisible();

    // Unlock zones and drag one
    const zoneLockBtn = page.getByTestId('zone-lock-toggle');
    await zoneLockBtn.click();

    const zone = page.locator('.react-flow__node-zoneContainer').first();
    await zone.waitFor({ state: 'visible' });
    const beforeBox = await zone.boundingBox();
    expect(beforeBox).toBeTruthy();

    const from = {
      x: beforeBox!.x + beforeBox!.width / 2,
      y: beforeBox!.y + 20,
    };
    const to = { x: from.x + 100, y: from.y + 80 };

    await singleFingerDrag(page, from, to, 10);
    await page.waitForTimeout(300);

    // Verify the zone moved
    const afterDragBox = await zone.boundingBox();
    expect(afterDragBox).toBeTruthy();
    const dragDist = Math.abs(afterDragBox!.x - beforeBox!.x) + Math.abs(afterDragBox!.y - beforeBox!.y);
    expect(dragDist).toBeGreaterThan(30);

    // Reset button should now be visible
    await expect(resetBtn).toBeVisible();

    // Click reset
    await resetBtn.click();
    await page.waitForTimeout(600); // wait for fitView animation

    // Reset button should disappear
    await expect(resetBtn).not.toBeVisible();
  });
});
