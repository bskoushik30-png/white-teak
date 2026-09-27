const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: require('child_process').execSync('ls -1d $HOME/.cache/ms-playwright/chromium-*/chrome-linux/chrome 2>/dev/null || echo ""', { encoding: 'utf-8' }).trim() ||
                   require('child_process').execSync('ls -1d $HOME/.cache/ms-playwright/chromium-* 2>/dev/null | head -1', { encoding: 'utf-8' }).trim() + '/chrome-linux/chrome'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Get Elements' positions
  const getColor = async (section) => {
    await page.evaluate(() => {
      const el = document.querySelector('${section}');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(800);

    const bgColor = await page.evaluate(() => {
      const layer = document.querySelector('[style*="background"]');
      return window.getComputedStyle(layer || document.body).backgroundColor;
    });

    return bgColor;
  };

  const events = await getColor('#story');
  const arrivals = await getColor('#arrivals');
  const cards = await getColor('main > section:nth-child(6)');

  console.log(`Events (Story): ${events}`);
  console.log(`Arrivals (Summer Affair): ${arrivals}`);
  console.log(`Feature Cards: ${cards}`);

  const yellow = 'rgb(255, 211, 59)'; // #FFD93B
  const brown = 'rgb(46, 29, 22)'; // #2e1d16

  if (arrivals.includes('211') && arrivals.includes('59')) {
    console.log('✓ PASS: Arrivals is yellow');
  } else {
    console.log('✗ FAIL: Arrivals is NOT yellow');
  }

  if (cards.includes('46') && cards.includes('29')) {
    console.log('✓ PASS: Feature Cards are brown');
  } else {
    console.log('✗ FAIL: Feature Cards are NOT brown');
  }

  await browser.close();
})();
