import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  slowMo: 200
});

const page = await browser.newPage();

page.on('pageerror', err => console.log('❌ 頁面錯誤:', err.message));

try {
  console.log('載入首頁...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  console.log('進入專案管理...');
  await page.click('text=專案管理');
  await page.waitForTimeout(2000);
  
  console.log('點擊查看專案詳情...');
  // 點擊第一個專案的查看按鈕
  await page.locator('a[href="/projects/p1"]').first().click();
  await page.waitForTimeout(3000);
  
  // 檢查是否成功載入
  const hasError = await page.evaluate(() => {
    return document.body.textContent?.includes('error') || false;
  });
  
  if (!hasError) {
    console.log('✅ 專案詳情頁載入成功！');
    
    // 測試切換標籤
    console.log('測試任務管理標籤...');
    await page.click('text=任務管理');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/tasks-tab.png', fullPage: true });
    
    // 測試切換視圖
    console.log('測試甘特圖視圖...');
    await page.click('text=甘特圖');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/gantt-view.png', fullPage: true });
    
    console.log('測試泳道圖視圖...');
    await page.click('text=泳道圖');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/swimlane-view.png', fullPage: true });
    
    // 測試財務報表
    console.log('測試財務報表標籤...');
    await page.click('text=財務報表');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/finance-tab.png', fullPage: true });
    
    console.log('✅ 所有功能測試完成！');
  } else {
    console.log('❌ 頁面仍有錯誤');
  }
  
  console.log('\n測試完成，瀏覽器將在10秒後關閉...');
  await page.waitForTimeout(10000);
  
} catch (error) {
  console.error('測試失敗:', error.message);
} finally {
  await browser.close();
}