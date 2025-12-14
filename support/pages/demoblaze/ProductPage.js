const { expect } = require('@playwright/test');
const { ProductSelectors } = require('../../selectors/demoblaze/_index');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.sel = new ProductSelectors(page);
  }

  async waitForLoad() {
    await expect(this.sel.content).toBeVisible({ timeout: 10000 });
    return this;
  }

  async setupDialogHandler() {
    this.page.on('dialog', dialog => dialog.accept());
    return this;
  }

  async clickAddToCart() {
    await this.sel.addToCartBtn.click();
    return this;
  }

  async waitForCartAlert() {
    await this.page.waitForEvent('dialog', { timeout: 10000 });
    return this;
  }
}

module.exports = ProductPage;
