class ConfirmationSelectors {
  constructor(page) { this.page = page; }
  get modal() { return this.page.locator('.sweet-alert'); }
  get title() { return this.page.locator('.sweet-alert h2'); }
  get okBtn() { return this.page.locator('.confirm.btn-lg'); }
}

module.exports = { ConfirmationSelectors };
