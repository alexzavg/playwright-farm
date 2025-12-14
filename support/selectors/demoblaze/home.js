class HomeSelectors {
  constructor(page) { this.page = page; }
  get productCards() { return this.page.locator('#tbodyid .card'); }
  get productLinks() { return this.page.locator('#tbodyid .card-title a'); }
}

module.exports = { HomeSelectors };
