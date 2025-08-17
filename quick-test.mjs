import { chromium } from 'playwright';

console.log('啟動測試...');

const browser = await chromium.launch({ 
  headless: false,
  slowMo: 500 
});

const page = await browser.newPage();

try {
  console.log('訪問系統首頁...');
  await page.goto('http://localhost:5173/');
  
  console.log('等待頁面載入...');
  await page.waitForTimeout(3000);
  
  console.log('截取儀表板...');
  await page.screenshot({ path: 'screenshots/dashboard-test.png', fullPage: true });
  
  // 嘗試點擊專案管理
  try {
    console.log('點擊專案管理選單...');
    await page.click('text=專案管理', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/projects-test.png', fullPage: true });
    console.log('專案頁面截圖完成');
  } catch (e) {
    console.log('無法找到專案管理選單');
  }
  
  // 獲取頁面內容檢查
  const pageTitle = await page.title();
  console.log('頁面標題:', pageTitle);
  
  const bodyText = await page.textContent('body');
  console.log('\n頁面包含文字:', bodyText ? '有內容' : '無內容');
  
  if (bodyText) {
    console.log('前100個字元:', bodyText.substring(0, 100));
  }
  
  console.log('\n測試完成！瀏覽器將在5秒後關閉...');
  await page.waitForTimeout(5000);
  
} catch (error) {
  console.error('測試失敗:', error.message);
} finally {
  await browser.close();
  console.log('瀏覽器已關閉');
}