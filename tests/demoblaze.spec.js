const { test, expect } = require('@playwright/test');

test('Sales funnel: Add to cart and checkout', async ({ page }) => {
  
  await test.step('Navigate to homepage', async () => {
    await page.goto('/');
  });

  await test.step('Wait for products to load', async () => {
    await expect(page.locator('#tbodyid .card')).toHaveCount(9, { timeout: 15000 });
  });

  await test.step('Click on random product', async () => {
    const products = page.locator('#tbodyid .card-title a');
    const count = await products.count();
    const randomIndex = Math.floor(Math.random() * count);
    await products.nth(randomIndex).click();
  });

  await test.step('Wait for product page to load', async () => {
    await expect(page.locator('.product-content')).toBeVisible({ timeout: 10000 });
  });

  await test.step('Setup dialog handler for alert', async () => {
    page.on('dialog', dialog => dialog.accept());
  });

  await test.step('Click Add to cart button', async () => {
    await page.locator('a.btn-success:has-text("Add to cart")').click();
  });

  await test.step('Wait for cart confirmation alert', async () => {
    await page.waitForEvent('dialog', { timeout: 10000 });
  });

  await test.step('Click on Cart link', async () => {
    await page.locator('#cartur').click();
  });

  await test.step('Wait for cart to load with item', async () => {
    await expect(page.locator('#tbodyid tr')).toHaveCount(1, { timeout: 10000 });
  });

  await test.step('Click Place Order button', async () => {
    await page.locator('button:has-text("Place Order")').click();
  });

  await test.step('Wait for checkout modal to appear', async () => {
    await expect(page.locator('#orderModal')).toBeVisible({ timeout: 5000 });
  });

  await test.step('Fill name field', async () => {
    await page.locator('#name').fill('Test User');
  });

  await test.step('Fill country field', async () => {
    await page.locator('#country').fill('Ukraine');
  });

  await test.step('Fill city field', async () => {
    await page.locator('#city').fill('Kyiv');
  });

  await test.step('Fill credit card field', async () => {
    await page.locator('#card').fill('4111111111111111');
  });

  await test.step('Fill month field', async () => {
    await page.locator('#month').fill('12');
  });

  await test.step('Fill year field', async () => {
    await page.locator('#year').fill('2025');
  });

  await test.step('Click Purchase button', async () => {
    await page.locator('button:has-text("Purchase")').click();
  });

  await test.step('Wait for success modal to appear', async () => {
    await expect(page.locator('.sweet-alert')).toBeVisible({ timeout: 10000 });
  });

  await test.step('Verify purchase success message', async () => {
    await expect(page.locator('.sweet-alert h2')).toHaveText('Thank you for your purchase!');
  });

  await test.step('Click OK to close confirmation', async () => {
    await page.locator('.confirm.btn-lg').click();
  });

  await test.step('Wait for confirmation modal to close', async () => {
    await expect(page.locator('.sweet-alert')).not.toBeVisible({ timeout: 5000 });
  });
});
