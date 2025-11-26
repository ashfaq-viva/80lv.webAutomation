import BasePage from './BasePage';

export class TalentPage extends BasePage {
  constructor(page , context, loginPage) {
    super(page, context);
    this.loginPage = loginPage;
  }
  initLocators(page) {
    this.page = page;
    this.subscribeNowBtn = page.locator('div').filter({ hasText: /^Subscribe Now$/ }).first();
    this.mainTxt = page.getByRole('heading', { name: 'Find the right talent Right' });
    this.loginBtn = page.getByRole('link', { name: 'log in' });
  }

  async assertLoggedIn() {
    if (this.mainTxt.isVisible()) {
    await this.assert({
      locator: this.mainTxt,
      state: 'visible',
      alias: 'Find the right Talent text',
    });
  } else if (this.loginBtn.isVisible()) {
    await this.assert({
      locator: this.loginBtn,
      state: 'visible',
      alias: 'Login Button',
    });
  } else {
    throw new Error('❌ Neither main text nor login button is visible — login state invalid.');
  }
}
}

