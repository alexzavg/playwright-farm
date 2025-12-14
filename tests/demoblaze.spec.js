const { test } = require('./fixtures');

test('Sales funnel: Add to cart and checkout', async ({ homePage, productPage, cartPage, checkoutPage, confirmationPage }) => {
  
  await test.step('Navigate to homepage', async () => {
    await homePage.navigate();
  });

  await test.step('Wait for products to load', async () => {
    await homePage.waitForProducts();
  });

  await test.step('Click on random product', async () => {
    await homePage.clickRandomProduct();
  });

  await test.step('Wait for product page to load', async () => {
    await productPage.waitForLoad();
  });

  await test.step('Setup dialog handler for alert', async () => {
    await productPage.setupDialogHandler();
  });

  await test.step('Click Add to cart button', async () => {
    await productPage.clickAddToCart();
  });

  await test.step('Wait for cart confirmation alert', async () => {
    await productPage.waitForCartAlert();
  });

  await test.step('Click on Cart link', async () => {
    await cartPage.navigate();
  });

  await test.step('Wait for cart to load with item', async () => {
    await cartPage.waitForItems();
  });

  await test.step('Click Place Order button', async () => {
    await cartPage.clickPlaceOrder();
  });

  await test.step('Wait for checkout modal to appear', async () => {
    await checkoutPage.waitForModal();
  });

  await test.step('Fill name field', async () => {
    await checkoutPage.fillName('Test User');
  });

  await test.step('Fill country field', async () => {
    await checkoutPage.fillCountry('Ukraine');
  });

  await test.step('Fill city field', async () => {
    await checkoutPage.fillCity('Kyiv');
  });

  await test.step('Fill credit card field', async () => {
    await checkoutPage.fillCard('4111111111111111');
  });

  await test.step('Fill month field', async () => {
    await checkoutPage.fillMonth('12');
  });

  await test.step('Fill year field', async () => {
    await checkoutPage.fillYear('2025');
  });

  await test.step('Click Purchase button', async () => {
    await checkoutPage.clickPurchase();
  });

  await test.step('Wait for success modal to appear', async () => {
    await confirmationPage.waitForModal();
  });

  await test.step('Verify purchase success message', async () => {
    await confirmationPage.verifySuccess();
  });

  await test.step('Click OK to close confirmation', async () => {
    await confirmationPage.clickOk();
  });

  await test.step('Wait for confirmation modal to close', async () => {
    await confirmationPage.waitForClose();
  });
});
