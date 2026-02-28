import { test, expect } from '@playwright/test';
import { pinchZoom, pinchZoomSequential, singleFingerDrag } from './helpers/touch';
import {
  getViewportTransform,
  waitForGraphReady,
  getFirstNodeCenter,
  getEmptyPanePoint,
} from './helpers/graph';

test.describe('Pinch-to-zoom on React Flow graph', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGraphReady(page);
  });

  test('graph loads with nodes visible', async ({ page }) => {
    const count = await page.locator('.react-flow__node').count();
    expect(count).toBeGreaterThan(0);
  });

  test('pinch-to-zoom on background pane works (baseline)', async ({ page }) => {
    const target = await getEmptyPanePoint(page);
    const before = await getViewportTransform(page);

    // Pinch outward (fingers spread) => zoom in
    await pinchZoom(page, target, 50, 200, 10);
    await page.waitForTimeout(300);

    const after = await getViewportTransform(page);
    expect(after.scale).toBeGreaterThan(before.scale);
  });

  test('pinch-to-zoom starting on a node works (simultaneous fingers)', async ({
    page,
  }) => {
    const center = await getFirstNodeCenter(page);
    const before = await getViewportTransform(page);

    // Both fingers touch down on the node simultaneously, then spread
    await pinchZoom(page, center, 50, 200, 10);
    await page.waitForTimeout(300);

    const after = await getViewportTransform(page);
    // Critical assertion: zoom must change even when pinch starts on a node
    expect(after.scale).toBeGreaterThan(before.scale);
  });

  test('pinch-to-zoom starting on a node works (sequential fingers)', async ({
    page,
  }) => {
    const center = await getFirstNodeCenter(page);
    const before = await getViewportTransform(page);

    // First finger down, pause, then second finger joins — more realistic
    await pinchZoomSequential(page, center, 50, 200, 10);
    await page.waitForTimeout(300);

    const after = await getViewportTransform(page);
    expect(after.scale).toBeGreaterThan(before.scale);
  });

  test('single-finger node drag still works (regression)', async ({ page }) => {
    const node = page.locator('.react-flow__node').first();
    const beforeBox = await node.boundingBox();
    expect(beforeBox).toBeTruthy();

    const from = {
      x: beforeBox!.x + beforeBox!.width / 2,
      y: beforeBox!.y + beforeBox!.height / 2,
    };
    const to = { x: from.x + 80, y: from.y + 60 };

    await singleFingerDrag(page, from, to, 10);
    await page.waitForTimeout(300);

    const afterBox = await node.boundingBox();
    expect(afterBox).toBeTruthy();

    // Node should have moved meaningfully in the drag direction
    const dx = Math.abs(afterBox!.x - beforeBox!.x);
    const dy = Math.abs(afterBox!.y - beforeBox!.y);
    expect(dx + dy).toBeGreaterThan(30);
  });
});
