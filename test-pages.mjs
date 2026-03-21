import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8080';

async function testPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  const consoleErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), message: msg.text() });
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push({ url: page.url(), message: error.message });
  });

  const pages = [
    { name: 'Builder (/canvas)', url: '/canvas' },
    { name: 'Dashboard (/dashboard)', url: '/dashboard' },
    { name: 'Marketplaces (/marketplaces)', url: '/marketplaces' },
    { name: 'Analytics (/analytics)', url: '/analytics' },
    { name: 'Explore (/explore)', url: '/explore' },
    { name: 'Settings (/settings)', url: '/settings' },
  ];

  console.log('🧪 Testing RealFlow Studio pages...\n');

  for (const p of pages) {
    try {
      const response = await page.goto(`${BASE_URL}${p.url}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      const status = response?.status() || 0;
      const title = await page.title();
      
      // Check if page loaded content
      const bodyText = await page.textContent('body');
      const hasContent = bodyText && bodyText.length > 50;
      
      results.push({
        name: p.name,
        url: p.url,
        status,
        title,
        hasContent,
        success: status === 200 && hasContent
      });
      
      console.log(`${status === 200 ? '✅' : '❌'} ${p.name}`);
      console.log(`   Status: ${status}`);
      console.log(`   Title: ${title}`);
      console.log(`   Has Content: ${hasContent ? 'Yes' : 'No'}`);
      console.log('');
      
      // Wait a bit between page loads
      await page.waitForTimeout(500);
    } catch (error) {
      results.push({
        name: p.name,
        url: p.url,
        error: error.message,
        success: false
      });
      console.log(`❌ ${p.name} - ERROR: ${error.message}\n`);
    }
  }

  // Test backend API
  console.log('🔌 Testing Backend API...\n');
  const apiTests = [
    { name: 'Health Check', url: 'http://localhost:5000/api/health' },
    { name: 'AI Generate Code', url: 'http://localhost:5000/api/ai/generate-code' },
  ];

  for (const api of apiTests) {
    try {
      const response = await page.goto(api.url, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      const status = response?.status() || 0;
      const body = await page.textContent('body');
      const isJson = body?.startsWith('{') || body?.startsWith('[');
      
      console.log(`${status === 200 ? '✅' : '⚠️'} ${api.name}`);
      console.log(`   Status: ${status}`);
      console.log(`   JSON Response: ${isJson ? 'Yes' : 'No'}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${api.name} - ERROR: ${error.message}\n`);
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Pages tested: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (consoleErrors.length > 0) {
    console.log(`\n⚠️  Console Errors: ${consoleErrors.length}`);
    consoleErrors.slice(0, 5).forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.message.slice(0, 100)}`);
    });
    if (consoleErrors.length > 5) {
      console.log(`   ... and ${consoleErrors.length - 5} more`);
    }
  } else {
    console.log(`\n✅ No console errors detected`);
  }

  await browser.close();
  
  // Exit with error if any tests failed
  if (failed > 0) {
    process.exit(1);
  }
}

testPages().catch(console.error);
