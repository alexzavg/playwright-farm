const { expect } = require('@playwright/test');
const selectors = require('../selectors');

class CartPage {
  constructor(page) {
    this.page = page;
    this.sel = selectors.cart;
  }

  async navigate() {
    await this.page.locator(this.sel.link).click();
    return this;
  }

  async waitForItems(count = 1) {
    await expect(this.page.locator(this.sel.items)).toHaveCount(count, { timeout: 10000 });
    return this;
  }

  async clickPlaceOrder() {
    await this.page.locator(this.sel.placeOrderBtn).click();
    return this;
  }
}

module.exports = CartPage;
