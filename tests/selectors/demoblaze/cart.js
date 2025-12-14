class CartSelectors {
  constructor(page) { this.page = page; }
  get link() { return this.page.locator('#cartur'); }
  get items() { return this.page.locator('#tbodyid tr'); }
  get placeOrderBtn() { return this.page.getByRole('button', { name: 'Place Order' }); }
}

module.exports = { CartSelectors };
