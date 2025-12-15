const { test } = require('../../support/fixtures');

test('Browse funnel: View products', async ({ demoblaze }) => {
  
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

  await test.step('Verify product details visible', async () => {
    await demoblaze.productPage.verifyDetailsVisible();
  });
});
