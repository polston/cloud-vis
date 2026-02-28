import type { Page } from '@playwright/test';

export interface ViewportTransform {
  translateX: number;
  translateY: number;
  scale: number;
}

/**
 * Parse the viewport transform from the .react-flow__viewport element.
 * React Flow sets: transform: translate(Xpx, Ypx) scale(Z)
 */
export async function getViewportTransform(page: Page): Promise<ViewportTransform> {
  return page.locator('.react-flow__viewport').evaluate((el) => {
    const style = el.getAttribute('style') ?? '';
    const match = style.match(
      /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)/
    );
    if (!match) {
      throw new Error(`Cannot parse viewport transform from: ${style}`);
    }
    return {
      translateX: parseFloat(match[1]),
      translateY: parseFloat(match[2]),
      scale: parseFloat(match[3]),
    };
  });
}

/**
 * Wait until the graph is loaded and fitView animation has settled.
 * The app uses: setTimeout(() => fitView({ duration: 300 }), 50)
 */
export async function waitForGraphReady(page: Page): Promise<void> {
  await page.locator('.react-flow__viewport').waitFor({ state: 'attached' });
  await page.locator('.react-flow__node').first().waitFor({ state: 'visible' });
  // 50ms delay + 300ms fitView animation + buffer
  await page.waitForTimeout(600);
}

/**
 * Get center coordinates of the first visible cloud node (service or group).
 */
export async function getFirstNodeCenter(
  page: Page,
): Promise<{ x: number; y: number }> {
  const node = page.locator('.react-flow__node').first();
  const box = await node.boundingBox();
  if (!box) throw new Error('No node found or not visible');
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
}

/**
 * Get a point on the background pane away from any nodes.
 * Uses the center of the renderer, offset slightly to avoid node overlap.
 */
export async function getEmptyPanePoint(page: Page): Promise<{ x: number; y: number }> {
  const renderer = page.locator('.react-flow__renderer');
  const box = await renderer.boundingBox();
  if (!box) throw new Error('Renderer element not found');
  // Use center of the renderer area (reliable for zoom gestures)
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
}
