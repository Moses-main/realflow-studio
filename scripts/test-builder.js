import { chromium } from 'playwright';

async function testBuilder() {
  console.log('🔍 Testing Builder Page in detail...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    console.log('📍 Loading Builder page...');
    await page.goto('http://localhost:8081/builder', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if page has content
    const html = await page.content();
    console.log(`📄 HTML length: ${html.length} characters`);
    
    // Get body text
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log(`📝 Body text length: ${bodyText.length} characters`);
    console.log(`📝 Body text preview:\n${bodyText.substring(0, 300)}`);
    
    // Check for React app root
    const root = await page.locator('#root').count();
    console.log(`\n📊 React root element found: ${root}`);
    
    // Check for any visible content
    const bodyChildren = await page.evaluate(() => document.body.children.length);
    console.log(`📊 Body children count: ${bodyChildren}`);
    
    // List all elements
    const allDivs = await page.locator('div').count();
    console.log(`📊 Total divs: ${allDivs}`);
    
    // Check for any error message in the app
    const errorMessages = await page.locator('text=error, text=Error, text=failed').count();
    console.log(`\n❌ Error/failed text found: ${errorMessages}`);
    
    // Check for specific UI elements
    const hasCanvas = await page.locator('[class*="canvas"], [class*="Canvas"]').count();
    const hasBuilder = await page.locator('[class*="builder"], [class*="Builder"]').count();
    console.log(`\n📊 Canvas elements: ${hasCanvas}`);
    console.log(`📊 Builder elements: ${hasBuilder}`);
    
    // Try to find any interactive elements
    const inputs = await page.locator('input').count();
    const textareas = await page.locator('textarea').count();
    const buttons = await page.locator('button').count();
    console.log(`\n🔘 Inputs: ${inputs}`);
    console.log(`📝 Textareas: ${textareas}`);
    console.log(`🔘 Buttons: ${buttons}`);
    
    // Error summary
    if (errors.length > 0) {
      console.log('\n' + '='.repeat(50));
      console.log('❌ CONSOLE ERRORS:');
      console.log('='.repeat(50));
      errors.forEach((e, i) => {
        console.log(`${i + 1}. ${e.substring(0, 200)}`);
      });
    } else {
      console.log('\n✅ No console errors');
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.slice(0, 5).forEach((w, i) => {
        console.log(`${i + 1}. ${w.substring(0, 150)}`);
      });
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

testBuilder();
