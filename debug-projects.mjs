import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  devtools: true
});

const page = await browser.newPage();

// 監聽所有控制台訊息
page.on('console', msg => {
  console.log(`[${msg.type()}]:`, msg.text());
});

page.on('pageerror', err => {
  console.log('頁面錯誤:', err.message);
});

try {
  console.log('直接訪問 /projects 頁面...');
  await page.goto('http://localhost:5173/projects');
  await page.waitForTimeout(3000);
  
  // 檢查頁面內容
  const pageContent = await page.textContent('body');
  console.log('頁面文字長度:', pageContent?.length);
  console.log('頁面內容預覽:', pageContent?.substring(0, 200));
  
  // 檢查是否有錯誤
  const hasError = await page.evaluate(() => {
    const body = document.body.textContent || '';
    return body.includes('error') || body.includes('Error');
  });
  
  console.log('頁面有錯誤:', hasError);
  
  // 檢查專案數據
  const result = await page.evaluate(() => {
    // 嘗試獲取 React 應用狀態
    const root = document.getElementById('root');
    const hasContent = root && root.children.length > 0;
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    
    return {
      hasRoot: !!root,
      hasContent,
      cardCount: cards.length,
      rootHTML: root?.innerHTML.substring(0, 500)
    };
  });
  
  console.log('檢查結果:', result);
  
  // 截圖
  await page.screenshot({ path: 'screenshots/debug-projects.png', fullPage: true });
  
  console.log('\n保持開啟以查看開發者工具...');
  await page.waitForTimeout(20000);
  
} catch (error) {
  console.error('錯誤:', error);
} finally {
  await browser.close();
}