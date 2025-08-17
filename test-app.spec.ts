import { test, expect } from '@playwright/test';

test.describe('工程管理系統測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('系統載入與基本導航', async ({ page }) => {
    // 檢查系統標題
    await expect(page.locator('h1').first()).toContainText('工程管理系統');
    
    // 檢查儀表板載入
    await expect(page.locator('h1').filter({ hasText: '儀表板' })).toBeVisible();
    
    // 檢查導航選單
    await expect(page.getByText('專案管理')).toBeVisible();
    await expect(page.getByText('任務中心')).toBeVisible();
    await expect(page.getByText('客戶管理')).toBeVisible();
    
    // 截圖儀表板
    await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: true });
  });

  test('專案列表頁面', async ({ page }) => {
    // 導航到專案列表
    await page.click('text=專案管理');
    await page.waitForURL('**/projects');
    
    // 檢查專案列表標題
    await expect(page.locator('h1').filter({ hasText: '專案管理' })).toBeVisible();
    
    // 檢查是否有專案卡片
    await expect(page.locator('.bg-white.rounded-lg.shadow-sm').first()).toBeVisible();
    
    // 檢查專案資訊顯示
    await expect(page.getByText('台北辦公室新建工程')).toBeVisible();
    
    // 截圖專案列表
    await page.screenshot({ path: 'screenshots/projects.png', fullPage: true });
  });

  test('專案詳情與視圖切換', async ({ page }) => {
    // 進入專案詳情
    await page.click('text=專案管理');
    await page.click('text=台北辦公室新建工程');
    
    // 等待頁面載入
    await page.waitForSelector('text=任務管理');
    
    // 切換到任務管理標籤
    await page.click('text=任務管理');
    
    // 測試看板視圖
    await expect(page.getByText('待辦')).toBeVisible();
    await expect(page.getByText('進行中')).toBeVisible();
    await expect(page.getByText('已完成')).toBeVisible();
    
    // 截圖看板視圖
    await page.screenshot({ path: 'screenshots/kanban.png', fullPage: true });
    
    // 切換到甘特圖
    await page.click('text=甘特圖');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/gantt.png', fullPage: true });
    
    // 切換到列表視圖
    await page.click('text=列表');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/list.png', fullPage: true });
    
    // 切換到泳道圖
    await page.click('text=泳道圖');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/swimlane.png', fullPage: true });
  });

  test('角色切換功能', async ({ page }) => {
    // 點擊切換角色
    await page.click('text=切換角色');
    
    // 檢查角色選單
    await expect(page.getByText('業主視角')).toBeVisible();
    await expect(page.getByText('專案經理視角')).toBeVisible();
    await expect(page.getByText('師傅視角')).toBeVisible();
    await expect(page.getByText('客戶視角')).toBeVisible();
    
    // 切換到師傅視角
    await page.click('text=師傅視角');
    await page.waitForTimeout(500);
    
    // 進入任務中心
    await page.click('text=任務中心');
    await page.waitForURL('**/tasks');
    
    // 檢查師傅任務頁面
    await expect(page.locator('h1').filter({ hasText: '我的任務' })).toBeVisible();
    
    // 截圖師傅任務頁面
    await page.screenshot({ path: 'screenshots/craftsman-tasks.png', fullPage: true });
  });

  test('財務報表檢視', async ({ page }) => {
    // 進入專案詳情
    await page.click('text=專案管理');
    await page.click('text=台北辦公室新建工程');
    
    // 切換到財務報表
    await page.click('text=財務報表');
    
    // 檢查財務資訊
    await expect(page.getByText('成本明細')).toBeVisible();
    await expect(page.getByText('利潤分析')).toBeVisible();
    
    // 截圖財務報表
    await page.screenshot({ path: 'screenshots/finance.png', fullPage: true });
  });

  test('響應式設計測試', async ({ page }) => {
    // 測試手機視圖
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'screenshots/mobile-dashboard.png', fullPage: true });
    
    // 測試平板視圖
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshots/tablet-dashboard.png', fullPage: true });
    
    // 測試桌面視圖
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'screenshots/desktop-dashboard.png', fullPage: true });
  });
});

test('系統效能測試', async ({ page }) => {
  // 測量頁面載入時間
  const startTime = Date.now();
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  console.log(`頁面載入時間: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000); // 期望載入時間小於3秒
  
  // 測試導航速度
  const navStart = Date.now();
  await page.click('text=專案管理');
  await page.waitForURL('**/projects');
  const navTime = Date.now() - navStart;
  
  console.log(`導航時間: ${navTime}ms`);
  expect(navTime).toBeLessThan(1000); // 期望導航時間小於1秒
});