import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { chromium } = await import('playwright');

const fileUrl = pathToFileURL(new URL('./index.html', import.meta.url).pathname).href;
const browser = await chromium.launch({ headless: true });

async function checkViewport(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) errors.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  await page.goto(fileUrl);
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const badge = document.querySelector('.badge').getBoundingClientRect();
    const about = document.querySelector('#aboutBtn').getBoundingClientRect();
    const logo = document.querySelector('.logo-wrap').getBoundingClientRect();
    const player = document.querySelector('.player').getBoundingClientRect();
    const badgeStyle = getComputedStyle(document.querySelector('.badge'));
    const aboutStyle = getComputedStyle(document.querySelector('#aboutBtn'));
    return {
      bodyWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      badgeText: document.querySelector('.badge span').textContent.trim(),
      badgeFont: badgeStyle.fontSize,
      aboutFont: aboutStyle.fontSize,
      logoTop: logo.top,
      logoBottom: logo.bottom,
      playerTop: player.top,
      badgeHeight: badge.height,
      aboutHeight: about.height,
    };
  });

  assert.equal(metrics.badgeText, '氛围电台', `${width}px badge text`);
  assert.equal(metrics.badgeFont, metrics.aboutFont, `${width}px badge/about font match`);
  assert.ok(metrics.scrollWidth <= metrics.bodyWidth, `${width}px has horizontal overflow`);
  assert.ok(metrics.logoTop < metrics.playerTop, `${width}px logo should begin above player`);
  if (width < 760) {
    assert.ok(metrics.playerTop - metrics.logoBottom >= 24, `${width}px should preserve atmosphere space`);
  } else {
    assert.ok(metrics.playerTop > height * 0.3, `${width}px should keep player in the lower original zone`);
  }
  assert.ok(Math.abs(metrics.badgeHeight - metrics.aboutHeight) <= 6, `${width}px badge/about height should be close`);
  assert.deepEqual(errors, [], `${width}px console/page errors`);
  await page.close();
}

await checkViewport(390, 844);
await checkViewport(1280, 800);

const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto(fileUrl);
const downloadPromise = page.waitForEvent('download');
await page.click('#shareBtn');
const download = await downloadPromise;
assert.match(download.suggestedFilename(), /modern-people-lab-radio-poster\.png$/, 'share should download poster png');
await page.close();

await browser.close();
console.log('random radio v0.4 browser checks passed');
