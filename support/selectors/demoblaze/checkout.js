class CheckoutSelectors {
  constructor(page) { this.page = page; }
  get modal() { return this.page.locator('#orderModal'); }
  get name() { return this.page.locator('#name'); }
  get country() { return this.page.locator('#country'); }
  get city() { return this.page.locator('#city'); }
  get card() { return this.page.locator('#card'); }
  get month() { return this.page.locator('#month'); }
  get year() { return this.page.locator('#year'); }
  get purchaseBtn() { return this.page.getByRole('button', { name: 'Purchase' }); }
}

module.exports = { CheckoutSelectors };
