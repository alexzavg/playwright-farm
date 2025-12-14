const { expect } = require('@playwright/test');
const { ConfirmationSelectors } = require('../../selectors/demoblaze/_index');

class ConfirmationPage {
  constructor(page) {
    this.page = page;
    this.sel = new ConfirmationSelectors(page);
  }

  async waitForModal() {
    await expect(this.sel.modal).toBeVisible({ timeout: 10000 });
    return this;
  }

  async verifySuccess() {
    await expect(this.sel.title).toHaveText('Thank you for your purchase!');
    return this;
  }

  async clickOk() {
    await this.sel.okBtn.click();
    return this;
  }

  async waitForClose() {
    await expect(this.sel.modal).not.toBeVisible({ timeout: 5000 });
    return this;
  }
}

module.exports = ConfirmationPage;
