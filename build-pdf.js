// build-pdf.js
const puppeteer = require('puppeteer');
const path = require('path');

// ── 설정 ──
const OUTPUT_DIR = 'C:/Users/USER/OneDrive/Desktop/포폴/PDF';   // 변환된 PDF 저장 경로
const PAGE_START = 1;         // 시작 페이지
const PAGE_END   = 20;        // 끝 페이지

(async () => {
  const fs = require('fs');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const pages = [];
  for (let i = PAGE_START; i <= PAGE_END; i++) {
    pages.push(`page${i}.html`);
  }

  const browser = await puppeteer.launch();

  for (const file of pages) {
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(file)}`, {
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
  const count = PAGE_END - PAGE_START + 1;
  console.log(`\n완료 — ${count}개 PDF 생성됨 (page${PAGE_START}~page${PAGE_END})`);
})();