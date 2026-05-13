// build-pdf.js
const puppeteer = require('puppeteer');
const path = require('path');
const { pathToFileURL } = require('url');   // ← 추가

// ── 설정 ──
const OUTPUT_DIR = 'C:/Users/USER/OneDrive/Desktop/포폴/PDF';
const PAGE_START = 1;
const PAGE_END   = 20;
const EXTRA_FILES = ['resume.html'];

(async () => {
  const fs = require('fs');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const pages = [];
  for (let i = PAGE_START; i <= PAGE_END; i++) {
    pages.push(`page${i}.html`);
  }
  pages.push(...EXTRA_FILES);

  const browser = await puppeteer.launch();

  for (const file of pages) {
    const absPath = path.resolve(file);

    // 파일 존재 여부 먼저 확인 → 없으면 스킵하고 에러 메시지만 출력
    if (!fs.existsSync(absPath)) {
      console.warn(`✗ 건너뜀 — 파일 없음: ${absPath}`);
      continue;
    }

    const page = await browser.newPage();
    await page.goto(pathToFileURL(absPath).href, {   // ← 여기가 핵심 변경
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    const outName = path.join(OUTPUT_DIR, file.replace('.html', '.pdf'));
    await page.pdf({
      path: outName,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await page.close();
    console.log(`✓ ${outName}`);
  }

  await browser.close();
  console.log(`\n완료`);
})();