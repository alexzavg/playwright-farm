const { expect } = require('@playwright/test');
const selectors = require('../selectors');

class HomePage {
  constructor(page) {
    this.page = page;
    this.sel = selectors.home;
  }

  async navigate() {
    await this.page.goto('/');
    return this;
  }

  async waitForProducts(count = 9) {
    await expect(this.page.locator(this.sel.productCards)).toHaveCount(count, { timeout: 15000 });
    return this;
  }

  async clickRandomProduct() {
    const products = this.page.locator(this.sel.productLinks);
    const count = await products.count();
    const randomIndex = Math.floor(Math.random() * count);
    await products.nth(randomIndex).click();
    return this;
  }
}

module.exports = HomePage;
