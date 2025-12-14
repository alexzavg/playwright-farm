class ProductSelectors {
  constructor(page) { this.page = page; }
  get content() { return this.page.locator('.product-content'); }
  get addToCartBtn() { return this.page.locator('a.btn-success').filter({ hasText: 'Add to cart' }); }
}

module.exports = { ProductSelectors };
