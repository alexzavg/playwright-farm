const { expect } = require('@playwright/test');
const { CartSelectors } = require('../../selectors/demoblaze/_index');

class CartPage {
  constructor(page) {
    this.page = page;
    this.sel = new CartSelectors(page);
  }

  async navigate() {
    await this.sel.link.click();
    return this;
  }

  async waitForItems(count = 1) {
    await expect(this.sel.items).toHaveCount(count, { timeout: 10000 });
    return this;
  }

  async clickPlaceOrder() {
    await this.sel.placeOrderBtn.click();
    return this;
  }
}

module.exports = CartPage;
