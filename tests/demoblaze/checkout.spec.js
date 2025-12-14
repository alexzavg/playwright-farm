const { test } = require('../../support/fixtures');

test('Sales funnel: Add to cart and checkout', async ({ demoblaze }) => {
  
  await test.step('Navigate to homepage', async () => {
    await demoblaze.homePage.navigate();
  });

  await test.step('Wait for products to load', async () => {
    await demoblaze.homePage.waitForProducts();
  });

  await test.step('Click on random product', async () => {
    await demoblaze.homePage.clickRandomProduct();
  });

  await test.step('Wait for product page to load', async () => {
    await demoblaze.productPage.waitForLoad();
  });

  await test.step('Setup dialog handler for alert', async () => {
    await demoblaze.productPage.setupDialogHandler();
  });

  await test.step('Click Add to cart button', async () => {
    await demoblaze.productPage.clickAddToCart();
  });

  await test.step('Wait for cart confirmation alert', async () => {
    await demoblaze.productPage.waitForCartAlert();
  });

  await test.step('Click on Cart link', async () => {
    await demoblaze.cartPage.navigate();
  });

  await test.step('Wait for cart to load with item', async () => {
    await demoblaze.cartPage.waitForItems();
  });

  await test.step('Click Place Order button', async () => {
    await demoblaze.cartPage.clickPlaceOrder();
  });

  await test.step('Wait for checkout modal to appear', async () => {
    await demoblaze.checkoutPage.waitForModal();
  });

  await test.step('Fill name field', async () => {
    await demoblaze.checkoutPage.fillName('Test User');
  });

  await test.step('Fill country field', async () => {
    await demoblaze.checkoutPage.fillCountry('Ukraine');
  });

  await test.step('Fill city field', async () => {
    await demoblaze.checkoutPage.fillCity('Kyiv');
  });

  await test.step('Fill credit card field', async () => {
    await demoblaze.checkoutPage.fillCard('4111111111111111');
  });

  await test.step('Fill month field', async () => {
    await demoblaze.checkoutPage.fillMonth('12');
  });

  await test.step('Fill year field', async () => {
    await demoblaze.checkoutPage.fillYear('2025');
  });

  await test.step('Click Purchase button', async () => {
    await demoblaze.checkoutPage.clickPurchase();
  });

  await test.step('Wait for success modal to appear', async () => {
    await demoblaze.confirmationPage.waitForModal();
  });

  await test.step('Verify purchase success message', async () => {
    await demoblaze.confirmationPage.verifySuccess();
  });

  await test.step('Click OK to close confirmation', async () => {
    await demoblaze.confirmationPage.clickOk();
  });

  await test.step('Wait for confirmation modal to close', async () => {
    await demoblaze.confirmationPage.waitForClose();
  });
});
