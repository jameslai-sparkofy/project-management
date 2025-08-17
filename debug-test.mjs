import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  devtools: true
});

const page = await browser.newPage();

// 監聽控制台訊息
page.on('console', msg => {
  console.log(`瀏覽器控制台 [${msg.type()}]:`, msg.text());
});

// 監聽頁面錯誤
page.on('pageerror', error => {
  console.error('頁面錯誤:', error.message);
});

try {
  console.log('訪問 http://localhost:5173/');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  // 等待一下讓錯誤顯示
  await page.waitForTimeout(3000);
  
  // 檢查是否有錯誤
  const errors = await page.evaluate(() => {
    const errorElements = document.querySelectorAll('.error, [class*="error"]');
    return Array.from(errorElements).map(el => el.textContent);
  });
  
  if (errors.length > 0) {
    console.log('頁面上的錯誤:', errors);
  }
  
  // 檢查 React 是否載入
  const hasReactRoot = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root && root.children.length > 0;
  });
  
  console.log('React 應用是否載入:', hasReactRoot);
  
  // 截圖
  await page.screenshot({ path: 'screenshots/debug-page.png', fullPage: true });
  
  console.log('保持瀏覽器開啟10秒查看開發者工具...');
  await page.waitForTimeout(10000);
  
} catch (error) {
  console.error('執行錯誤:', error);
} finally {
  await browser.close();
}