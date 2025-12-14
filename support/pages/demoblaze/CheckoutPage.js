const { expect } = require('@playwright/test');
const { CheckoutSelectors } = require('../../selectors/demoblaze/_index');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.sel = new CheckoutSelectors(page);
  }

  async waitForModal() {
    await expect(this.sel.modal).toBeVisible({ timeout: 5000 });
    return this;
  }

  async fillName(value) {
    await this.sel.name.fill(value);
    return this;
  }

  async fillCountry(value) {
    await this.sel.country.fill(value);
    return this;
  }

  async fillCity(value) {
    await this.sel.city.fill(value);
    return this;
  }

  async fillCard(value) {
    await this.sel.card.fill(value);
    return this;
  }

  async fillMonth(value) {
    await this.sel.month.fill(value);
    return this;
  }

  async fillYear(value) {
    await this.sel.year.fill(value);
    return this;
  }

  async clickPurchase() {
    await this.sel.purchaseBtn.click();
    return this;
  }
}

module.exports = CheckoutPage;
