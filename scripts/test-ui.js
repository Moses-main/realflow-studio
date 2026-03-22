import { chromium } from 'playwright';

async function testApp() {
  console.log('🚀 Starting RealFlow Studio UI Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    // 1. Go to the app
    console.log('📍 Navigating to app...');
    await page.goto('http://localhost:8080', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ App loaded\n');

    // 2. Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // 3. Check for login/wallet button
    console.log('\n📍 Looking for wallet connection...');
    const connectButton = await page.locator('button:has-text("Connect")').first();
    if (await connectButton.isVisible()) {
      console.log('✅ Connect wallet button found');
    } else {
      console.log('⚠️ Connect button not found, checking alternatives...');
      const anyButton = await page.locator('button').first();
      if (await anyButton.isVisible()) {
        console.log('✅ Other buttons found');
      }
    }

    // 4. Navigate to Explore page
    console.log('\n📍 Navigating to Explore...');
    await page.goto('http://localhost:8080/explore', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Check for marketplace cards
    const marketplaceCards = await page.locator('[class*="card"]').count();
    console.log(`📦 Found ${marketplaceCards} cards on explore page`);
    
    // Check for marketplace names
    const marketplaceNames = await page.locator('text=Marketplace').count();
    console.log(`🏪 Found ${marketplaceNames} marketplace references`);

    // 5. Navigate to Builder page
    console.log('\n📍 Navigating to Builder...');
    await page.goto('http://localhost:8080/builder', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Check for canvas
    const canvas = await page.locator('[class*="react-flow"]').first();
    if (await canvas.isVisible()) {
      console.log('✅ React Flow canvas found');
    } else {
      console.log('⚠️ React Flow canvas not visible');
    }
    
    // Check for component palette
    const componentPalette = await page.locator('text=Components').first();
    if (await componentPalette.isVisible()) {
      console.log('✅ Components panel found');
    }

    // Check for AI sidebar
    const aiSidebar = await page.locator('text=AI Co-Builder').first();
    if (await aiSidebar.isVisible()) {
      console.log('✅ AI Co-Builder panel found');
    }

    // 6. Check network selector
    console.log('\n📍 Checking network selector...');
    const networkSelector = await page.locator('text=Polygon Amoy').first();
    if (await networkSelector.isVisible()) {
      console.log('✅ Network selector found');
    }

    // 7. Try to add a component
    console.log('\n📍 Attempting to add a component...');
    const mintButton = await page.locator('text=Token Mint').first();
    if (await mintButton.isVisible()) {
      console.log('✅ Found Token Mint in palette');
      // Try to click and add it
      await mintButton.click();
      await page.waitForTimeout(500);
      const nodes = await page.locator('[class*="react-flow__node"]').count();
      console.log(`📊 Nodes on canvas: ${nodes}`);
    }

    // 8. Check console errors
    console.log('\n📍 Checking for console errors...');
    if (errors.length > 0) {
      console.log(`❌ Found ${errors.length} console errors:`);
      errors.slice(0, 5).forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.substring(0, 100)}...`);
      });
    } else {
      console.log('✅ No console errors detected');
    }

    // 9. Check API connectivity
    console.log('\n📍 Testing API connectivity...');
    const apiResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    });
    
    if (apiResponse.status === 'ok') {
      console.log('✅ Backend API is healthy');
    } else {
      console.log(`❌ API error: ${JSON.stringify(apiResponse)}`);
    }

    // 10. Test marketplace list API
    console.log('\n📍 Testing marketplaces API...');
    const marketplaceResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/marketplaces');
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    });
    
    if (marketplaceResponse.success) {
      console.log(`✅ Marketplaces API working - found ${marketplaceResponse.total} marketplaces`);
    } else {
      console.log(`❌ Marketplaces API error: ${JSON.stringify(marketplaceResponse)}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ App loads successfully`);
    console.log(`${errors.length > 0 ? '❌' : '✅'} Console errors: ${errors.length}`);
    console.log(`${marketplaceResponse.success ? '✅' : '❌'} Marketplace API: ${marketplaceResponse.success ? 'Working' : 'Failed'}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testApp();
