import { chromium } from 'playwright';

async function debugUI() {
  console.log('🔍 Deep debugging RealFlow Studio UI...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  try {
    // Test Explore Page
    console.log('📍 DEBUGGING EXPLORE PAGE');
    await page.goto('http://localhost:8080/explore', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take a look at what's on the page
    const bodyText = await page.locator('body').innerText();
    console.log('\n📝 Page content preview:');
    console.log(bodyText.substring(0, 500) + '...');
    
    // Check for any cards or marketplace items
    const cards = await page.locator('[class*="card"], [class*="Card"]').count();
    const marketplaceItems = await page.locator('[class*="marketplace"], [class*="Marketplace"]').count();
    console.log(`\n📊 Cards found: ${cards}`);
    console.log(`📊 Marketplace items found: ${marketplaceItems}`);
    
    // Check for loading state
    const loadingSpinner = await page.locator('[class*="loading"], [class*="spinner"]').count();
    console.log(`⏳ Loading indicators: ${loadingSpinner}`);
    
    // Test Builder Page
    console.log('\n\n📍 DEBUGGING BUILDER PAGE');
    await page.goto('http://localhost:8080/builder', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for React Flow
    const reactFlowExists = await page.locator('.react-flow').count();
    const reactFlowVisible = await page.locator('.react-flow').isVisible().catch(() => false);
    console.log(`\n📊 React Flow exists: ${reactFlowExists}`);
    console.log(`📊 React Flow visible: ${reactFlowVisible}`);
    
    // Check for panels
    const panels = await page.locator('text=Components').count();
    const aiPanel = await page.locator('text=AI Co-Builder').count();
    console.log(`📊 Components panel: ${panels}`);
    console.log(`📊 AI panel: ${aiPanel}`);
    
    // Check for sidebar/menu
    const sidebar = await page.locator('nav, [class*="sidebar"], [class*="Sidebar"]').count();
    console.log(`📊 Navigation/sidebar elements: ${sidebar}`);
    
    // List all visible buttons
    const buttons = await page.locator('button').all();
    console.log(`\n🔘 Total buttons found: ${buttons.length}`);
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].innerText().catch(() => 'N/A');
      if (text && text.trim()) {
        console.log(`   - Button ${i + 1}: "${text.substring(0, 30)}"`);
      }
    }
    
    // Check for any error boundaries
    const errorBoundary = await page.locator('text=Something went wrong, text=Error').count();
    console.log(`\n❌ Error boundaries/triggers: ${errorBoundary}`);
    
    // Check network requests that failed
    console.log('\n🌐 Checking for failed network requests...');
    const responses = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        responses.push(`${response.status()} - ${response.url()}`);
      }
    });
    
    await page.reload();
    await page.waitForTimeout(3000);
    
    if (responses.length > 0) {
      console.log(`❌ Found ${responses.length} failed requests:`);
      responses.slice(0, 5).forEach(r => console.log(`   - ${r}`));
    } else {
      console.log('✅ No failed network requests');
    }
    
    // Final error summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 DEBUG SUMMARY');
    console.log('='.repeat(50));
    if (errors.length > 0) {
      console.log(`❌ Console errors found (${errors.length}):`);
      errors.slice(0, 3).forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.substring(0, 150)}`);
      });
    } else {
      console.log('✅ No console errors');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugUI();
