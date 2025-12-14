const { expect } = require('@playwright/test');
const selectors = require('../selectors');

class ConfirmationPage {
  constructor(page) {
    this.page = page;
    this.sel = selectors.confirmation;
  }

  async waitForModal() {
    await expect(this.page.locator(this.sel.modal)).toBeVisible({ timeout: 10000 });
    return this;
  }

  async verifySuccess() {
    await expect(this.page.locator(this.sel.title)).toHaveText('Thank you for your purchase!');
    return this;
  }

  async clickOk() {
    await this.page.locator(this.sel.okBtn).click();
    return this;
  }

  async waitForClose() {
    await expect(this.page.locator(this.sel.modal)).not.toBeVisible({ timeout: 5000 });
    return this;
  }
}

module.exports = ConfirmationPage;
