const { expect } = require('@playwright/test');
const { HomeSelectors } = require('../../selectors/demoblaze/_index');

class HomePage {
  constructor(page) {
    this.page = page;
    this.sel = new HomeSelectors(page);
  }

  async navigate() {
    await this.page.goto('/');
    return this;
  }

  async waitForProducts(count = 9) {
    await expect(this.sel.productCards).toHaveCount(count, { timeout: 15000 });
    return this;
  }

  async clickRandomProduct() {
    const count = await this.sel.productLinks.count();
    const randomIndex = Math.floor(Math.random() * count);
    await this.sel.productLinks.nth(randomIndex).click();
    return this;
  }
}

module.exports = HomePage;
