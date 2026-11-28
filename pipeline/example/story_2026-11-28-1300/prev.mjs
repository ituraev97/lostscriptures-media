import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
const B = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const times = process.argv[3].split(',').map(Number); const out = process.argv[2];
const browser = await openBrowser('chrome', { browserExecutable: B });
const comp = await selectComposition({ serveUrl: 'build', id: 'Story', puppeteerInstance: browser, browserExecutable: B });
for (const t of times) {
  const f = Math.round(t * 30);
  await renderStill({ composition: comp, serveUrl: 'build', output: `${out}/f${String(f).padStart(5, '0')}.jpg`, frame: f, imageFormat: 'jpeg', jpegQuality: 70, puppeteerInstance: browser, browserExecutable: B });
}
await browser.close({ silent: true }); console.log('done', times.length);
