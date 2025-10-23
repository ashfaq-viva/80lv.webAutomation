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
  }

  async assertLoggedIn() {
    await this.assert({
        locator: this.mainTxt,
        state: 'visible',
        alias: 'Find the right Talent text'
      });
}
}