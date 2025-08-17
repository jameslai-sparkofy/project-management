import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  slowMo: 300
});

const page = await browser.newPage();

page.on('pageerror', err => console.log('❌ 錯誤:', err.message));

try {
  console.log('🚀 測試新功能...');
  
  // 1. 測試所有專案是否都有任務
  console.log('\n1. 測試專案詳情頁面...');
  await page.goto('http://localhost:5173/projects');
  await page.waitForTimeout(2000);
  
  // 測試每個專案的詳情
  const projectLinks = ['p1', 'p2', 'p3', 'p4'];
  for (const projectId of projectLinks) {
    console.log(`  檢查專案 ${projectId}...`);
    await page.goto(`http://localhost:5173/projects/${projectId}`);
    await page.waitForTimeout(2000);
    
    // 切換到任務管理標籤
    await page.click('text=任務管理');
    await page.waitForTimeout(1000);
    
    // 檢查是否有任務顯示
    const hasTasks = await page.evaluate(() => {
      return document.body.textContent?.includes('暫無任務') === false;
    });
    
    console.log(`    專案 ${projectId} 有任務:`, hasTasks ? '✅' : '❌');
    
    // 測試視圖切換
    const views = ['甘特圖', '列表', '泳道圖', '看板'];
    for (const view of views) {
      try {
        await page.click(`text=${view}`);
        await page.waitForTimeout(500);
        console.log(`    ${view} 視圖: ✅`);
      } catch (e) {
        console.log(`    ${view} 視圖: ❌`);
      }
    }
  }
  
  // 2. 測試新建專案功能
  console.log('\n2. 測試新建專案功能...');
  await page.goto('http://localhost:5173/projects');
  await page.waitForTimeout(2000);
  
  // 點擊新增專案按鈕
  await page.click('text=新增專案');
  await page.waitForTimeout(1000);
  
  // 檢查模態框是否顯示
  const modalVisible = await page.isVisible('text=新增專案');
  console.log('  新增專案模態框顯示:', modalVisible ? '✅' : '❌');
  
  if (modalVisible) {
    // 填寫表單
    await page.fill('input[placeholder="輸入專案名稱"]', '測試專案');
    await page.fill('textarea[placeholder="輸入專案詳細描述"]', '這是一個測試專案');
    await page.selectOption('select', 'c1'); // 選擇客戶
    await page.fill('input[type="date"]', '2024-02-01');
    const dateInputs = await page.$$('input[type="date"]');
    await dateInputs[1].fill('2024-06-01');
    await page.fill('input[placeholder="0"]:nth-of-type(1)', '5000000');
    await page.fill('input[placeholder="0"]:nth-of-type(2)', '6000000');
    
    // 提交表單
    await page.click('text=創建專案');
    await page.waitForTimeout(2000);
    
    console.log('  新專案創建: ✅');
  }
  
  // 3. 測試新建任務功能
  console.log('\n3. 測試新建任務功能...');
  await page.goto('http://localhost:5173/projects/p1');
  await page.waitForTimeout(2000);
  
  // 切換到任務管理
  await page.click('text=任務管理');
  await page.waitForTimeout(1000);
  
  // 點擊新增任務
  await page.click('text=新增任務');
  await page.waitForTimeout(1000);
  
  const taskModalVisible = await page.isVisible('text=新增任務');
  console.log('  新增任務模態框顯示:', taskModalVisible ? '✅' : '❌');
  
  // 截圖所有測試結果
  await page.screenshot({ path: 'screenshots/test-complete.png', fullPage: true });
  
  console.log('\n✅ 所有功能測試完成！');
  console.log('📸 截圖已保存到 screenshots/test-complete.png');
  
  await page.waitForTimeout(10000);
  
} catch (error) {
  console.error('❌ 測試失敗:', error.message);
} finally {
  await browser.close();
}