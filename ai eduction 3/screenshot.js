const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:8080');
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 2000));
  
  const canvasWidth = await page.$eval('#hero-bg-canvas', el => el.width);
  const canvasHeight = await page.$eval('#hero-bg-canvas', el => el.height);
  const canvasDisplay = await page.$eval('#hero-bg-canvas', el => window.getComputedStyle(el).display);
  console.log(`Canvas width: ${canvasWidth}, height: ${canvasHeight}, display: ${canvasDisplay}`);
  
  await browser.close();
})();
