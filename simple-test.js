import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('正在訪問系統...');
  await page.goto('http://localhost:5173/');
  
  console.log('等待頁面載入...');
  await page.waitForTimeout(3000);
  
  console.log('截取儀表板截圖...');
  await page.screenshot({ path: 'screenshots/test-dashboard.png', fullPage: true });
  
  console.log('點擊專案管理...');
  const projectsLink = await page.getByRole('link', { name: /專案管理/i });
  if (await projectsLink.isVisible()) {
    await projectsLink.click();
    await page.waitForTimeout(2000);
    console.log('截取專案列表截圖...');
    await page.screenshot({ path: 'screenshots/test-projects.png', fullPage: true });
  }
  
  console.log('測試完成！截圖已保存在 screenshots 資料夾');
  
  // 保持瀏覽器開啟10秒供查看
  await page.waitForTimeout(10000);
  
  await browser.close();
})();