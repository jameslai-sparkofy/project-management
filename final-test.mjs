import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  slowMo: 100
});

const page = await browser.newPage();

// 監聽錯誤
page.on('pageerror', error => {
  console.error('頁面錯誤:', error.message);
});

try {
  console.log('正在載入系統...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // 截取儀表板
  console.log('截取儀表板截圖...');
  await page.screenshot({ path: 'screenshots/final-dashboard.png', fullPage: true });
  
  // 檢查頁面內容
  const hasContent = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root && root.innerHTML.length > 100;
  });
  
  if (hasContent) {
    console.log('✅ 系統成功載入！');
    
    // 嘗試點擊專案管理
    try {
      await page.click('text=專案管理');
      await page.waitForTimeout(2000);
      console.log('✅ 進入專案管理頁面');
      await page.screenshot({ path: 'screenshots/final-projects.png', fullPage: true });
    } catch (e) {
      console.log('❌ 無法進入專案管理');
    }
    
    // 測試角色切換
    try {
      await page.click('text=切換角色');
      await page.waitForTimeout(1000);
      await page.click('text=師傅視角');
      console.log('✅ 切換到師傅視角');
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('❌ 無法切換角色');
    }
    
  } else {
    console.log('❌ 系統未正確載入');
    const bodyText = await page.textContent('body');
    console.log('頁面內容:', bodyText);
  }
  
  console.log('\n瀏覽器將在10秒後關閉，您可以手動測試...');
  await page.waitForTimeout(10000);
  
} catch (error) {
  console.error('測試失敗:', error);
} finally {
  await browser.close();
  console.log('測試結束');
}