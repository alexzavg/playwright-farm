const { expect } = require('@playwright/test');
const selectors = require('../selectors');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.sel = selectors.product;
  }

  async waitForLoad() {
    await expect(this.page.locator(this.sel.content)).toBeVisible({ timeout: 10000 });
    return this;
  }

  async setupDialogHandler() {
    this.page.on('dialog', dialog => dialog.accept());
    return this;
  }

  async clickAddToCart() {
    await this.page.locator(this.sel.addToCartBtn).click();
    return this;
  }

  async waitForCartAlert() {
    await this.page.waitForEvent('dialog', { timeout: 10000 });
    return this;
  }
}

module.exports = ProductPage;
