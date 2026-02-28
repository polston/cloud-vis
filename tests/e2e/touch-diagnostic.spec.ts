import { test, expect } from '@playwright/test';
import { waitForGraphReady } from './helpers/graph';

test.describe('Pinch-zoom fix verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGraphReady(page);
  });

  test('multi-touch on node triggers d3-zoom and nopan is restored', async ({ page }) => {
    // Part 1: verify the fix works for zoom
    // Target a draggable leaf node (not a zone container, which may be locked)
    const zoomResult = await page.evaluate(() => {
      const renderer = document.querySelector('.react-flow__renderer') as any;
      const node = (document.querySelector('.react-flow__node:not(.react-flow__node-zoneContainer)') ?? document.querySelector('.react-flow__node')) as any;
      if (!renderer || !node) return { error: 'elements not found' };

      const rect = renderer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const hadNoPan = node.classList.contains('nopan');

      delete renderer.__zooming;
      const initialK = renderer.__zoom?.k;

      const mkTouch = (id: number, x: number, y: number) =>
        new Touch({ identifier: id, target: node, clientX: x, clientY: y, pageX: x, pageY: y });

      const t0 = mkTouch(0, cx - 40, cy);
      const t1 = mkTouch(1, cx + 40, cy);

      node.dispatchEvent(new TouchEvent('touchstart', {
        bubbles: true, cancelable: true,
        touches: [t0, t1], targetTouches: [t0, t1], changedTouches: [t0, t1],
      }));

      const zoomingAfterStart = !!renderer.__zooming;

      for (let i = 1; i <= 3; i++) {
        const d = 40 + i * 40;
        const m0 = mkTouch(0, cx - d, cy);
        const m1 = mkTouch(1, cx + d, cy);
        node.dispatchEvent(new TouchEvent('touchmove', {
          bubbles: true, cancelable: true,
          touches: [m0, m1], targetTouches: [m0, m1], changedTouches: [m0, m1],
        }));
      }

      node.dispatchEvent(new TouchEvent('touchend', {
        bubbles: true, cancelable: true,
        touches: [], targetTouches: [], changedTouches: [t0, t1],
      }));

      return {
        hadNoPan,
        zoomingAfterStart,
        initialK,
        finalK: renderer.__zoom?.k,
        scaleChanged: renderer.__zoom?.k !== initialK,
      };
    });

    expect(zoomResult.hadNoPan).toBe(true);
    expect(zoomResult.zoomingAfterStart).toBe(true);
    expect(zoomResult.scaleChanged).toBe(true);

    // Part 2: verify nopan was restored (setTimeout fires after evaluate returns)
    await page.waitForTimeout(50);
    const nopanRestored = await page.evaluate(() => {
      const node = document.querySelector('.react-flow__node:not(.react-flow__node-zoneContainer)') ?? document.querySelector('.react-flow__node');
      return node?.classList.contains('nopan') ?? false;
    });
    expect(nopanRestored).toBe(true);
  });
});
