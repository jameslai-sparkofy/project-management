import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  slowMo: 300
});

const page = await browser.newPage();

page.on('pageerror', err => console.log('頁面錯誤:', err.message));
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log('控制台錯誤:', msg.text());
  }
});

try {
  console.log('載入首頁...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  console.log('點擊專案管理...');
  await page.click('text=專案管理');
  await page.waitForTimeout(2000);
  
  // 截圖專案列表
  await page.screenshot({ path: 'screenshots/projects-page.png', fullPage: true });
  
  // 檢查是否有專案
  const hasProjects = await page.evaluate(() => {
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    return cards.length > 0;
  });
  
  console.log('專案列表有內容:', hasProjects);
  
  if (hasProjects) {
    console.log('嘗試點擊第一個專案...');
    // 嘗試點擊眼睛圖標進入專案詳情
    const eyeIcon = await page.$('svg.lucide-eye');
    if (eyeIcon) {
      await eyeIcon.click();
      console.log('點擊了查看按鈕');
    } else {
      // 或者直接點擊專案標題
      await page.click('text=台北辦公室新建工程');
      console.log('點擊了專案標題');
    }
    
    await page.waitForTimeout(3000);
    
    // 截圖專案詳情
    await page.screenshot({ path: 'screenshots/project-detail.png', fullPage: true });
    
    // 檢查URL
    const url = page.url();
    console.log('當前URL:', url);
    
    // 檢查頁面內容
    const pageContent = await page.textContent('body');
    console.log('頁面是否有內容:', pageContent.length > 100);
  }
  
  console.log('測試完成，瀏覽器將保持開啟...');
  await page.waitForTimeout(30000);
  
} catch (error) {
  console.error('測試失敗:', error);
} finally {
  await browser.close();
}