const { test: base } = require('@playwright/test');
const demoblazePages = require('./pages/demoblaze/_index');

const test = base.extend({
  demoblaze: async ({ page }, use) => {
    await use({
      homePage: new demoblazePages.HomePage(page),
      productPage: new demoblazePages.ProductPage(page),
      cartPage: new demoblazePages.CartPage(page),
      checkoutPage: new demoblazePages.CheckoutPage(page),
      confirmationPage: new demoblazePages.ConfirmationPage(page),
    });
  },
});

module.exports = { test };
