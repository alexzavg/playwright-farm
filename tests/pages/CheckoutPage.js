const { expect } = require('@playwright/test');
const selectors = require('../selectors');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.sel = selectors.checkout;
  }

  async waitForModal() {
    await expect(this.page.locator(this.sel.modal)).toBeVisible({ timeout: 5000 });
    return this;
  }

  async fillName(value) {
    await this.page.locator(this.sel.name).fill(value);
    return this;
  }

  async fillCountry(value) {
    await this.page.locator(this.sel.country).fill(value);
    return this;
  }

  async fillCity(value) {
    await this.page.locator(this.sel.city).fill(value);
    return this;
  }

  async fillCard(value) {
    await this.page.locator(this.sel.card).fill(value);
    return this;
  }

  async fillMonth(value) {
    await this.page.locator(this.sel.month).fill(value);
    return this;
  }

  async fillYear(value) {
    await this.page.locator(this.sel.year).fill(value);
    return this;
  }

  async clickPurchase() {
    await this.page.locator(this.sel.purchaseBtn).click();
    return this;
  }
}

module.exports = CheckoutPage;
