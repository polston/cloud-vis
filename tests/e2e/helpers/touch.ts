import type { CDPSession, Page } from '@playwright/test';

interface Point {
  x: number;
  y: number;
}

async function dispatchTouch(
  cdp: CDPSession,
  type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel',
  touchPoints: Array<{ x: number; y: number; id?: number }>,
): Promise<void> {
  await cdp.send('Input.dispatchTouchEvent', {
    type,
    touchPoints: touchPoints.map((tp, i) => ({
      x: Math.round(tp.x),
      y: Math.round(tp.y),
      id: tp.id ?? i,
    })),
  });
}

/**
 * Simulate a two-finger pinch gesture using CDP trusted events.
 * Both fingers touch down simultaneously.
 *
 * startDistance < endDistance => zoom in (fingers spread apart)
 * startDistance > endDistance => zoom out (fingers move together)
 */
export async function pinchZoom(
  page: Page,
  center: Point,
  startDistance: number,
  endDistance: number,
  steps: number = 10,
): Promise<void> {
  const cdp = await page.context().newCDPSession(page);

  try {
    const halfStart = startDistance / 2;
    const halfEnd = endDistance / 2;

    // Both fingers down simultaneously
    await dispatchTouch(cdp, 'touchStart', [
      { x: center.x - halfStart, y: center.y, id: 0 },
      { x: center.x + halfStart, y: center.y, id: 1 },
    ]);

    // Move fingers apart/together
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const half = halfStart + (halfEnd - halfStart) * t;
      await dispatchTouch(cdp, 'touchMove', [
        { x: center.x - half, y: center.y, id: 0 },
        { x: center.x + half, y: center.y, id: 1 },
      ]);
      await page.waitForTimeout(16);
    }

    await dispatchTouch(cdp, 'touchEnd', []);
  } finally {
    await cdp.detach();
  }
}

/**
 * Simulate a sequential pinch: first finger touches, pause, then second
 * finger joins. This matches how real pinch gestures often begin.
 */
export async function pinchZoomSequential(
  page: Page,
  center: Point,
  startDistance: number,
  endDistance: number,
  steps: number = 10,
): Promise<void> {
  const cdp = await page.context().newCDPSession(page);

  try {
    const halfStart = startDistance / 2;
    const halfEnd = endDistance / 2;

    // First finger down alone
    await dispatchTouch(cdp, 'touchStart', [
      { x: center.x - halfStart, y: center.y, id: 0 },
    ]);
    await page.waitForTimeout(80);

    // Second finger joins (both fingers present)
    await dispatchTouch(cdp, 'touchStart', [
      { x: center.x - halfStart, y: center.y, id: 0 },
      { x: center.x + halfStart, y: center.y, id: 1 },
    ]);

    // Move fingers apart/together
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const half = halfStart + (halfEnd - halfStart) * t;
      await dispatchTouch(cdp, 'touchMove', [
        { x: center.x - half, y: center.y, id: 0 },
        { x: center.x + half, y: center.y, id: 1 },
      ]);
      await page.waitForTimeout(16);
    }

    await dispatchTouch(cdp, 'touchEnd', []);
  } finally {
    await cdp.detach();
  }
}

/**
 * Simulate a single-finger drag gesture.
 */
export async function singleFingerDrag(
  page: Page,
  from: Point,
  to: Point,
  steps: number = 10,
): Promise<void> {
  const cdp = await page.context().newCDPSession(page);

  try {
    await dispatchTouch(cdp, 'touchStart', [{ ...from, id: 0 }]);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      await dispatchTouch(cdp, 'touchMove', [
        {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
          id: 0,
        },
      ]);
      await page.waitForTimeout(16);
    }

    await dispatchTouch(cdp, 'touchEnd', []);
  } finally {
    await cdp.detach();
  }
}
