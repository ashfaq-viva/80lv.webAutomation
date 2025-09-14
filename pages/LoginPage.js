import { expect } from '@playwright/test';
import BasePage from './BasePage';

export class LoginPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.allowCookiesBtn= page.getByRole('button', { name: 'Accept all cookies' });
    this.allowCookiesBtnOld=page.locator('._3xpoo');
    this.loginLnk= page.getByText('LogIn');
    this.widgetFrame = page.frameLocator('#xl_widget iframe');
    this.emailTxt    = this.widgetFrame.getByTestId('log-in-form__fields-universal');
    this.passwordTxt = page.locator('#xl_widget iframe').contentFrame().getByTestId('log-in-form__fields-password');
    this.loginBtn= page.locator('#xl_widget iframe').contentFrame().getByTestId('login-form__button-submit');
    this.profileLoggedIn = page.getByRole('img', { name: 'profile_loggedin' });
    this.profileLogIn = page.getByRole('img', { name: 'profile_login' });
    this.articleMenu= page.locator('div').filter({ hasText: /^Articles$/ }).nth(1);
    this.allArticlesSubMenu= page.getByRole('link', { name: 'All articles' });
    this.articleMenuOld = page.getByRole('banner').getByText('Articles');
    this.allArticlesSubMenuOld = page.getByText('All Articles', { exact: true });
    this.specificArticleLink= page.getByRole('link', { name: 'Hollow Knight: Silksong\'s' });
  }

  async visit() {
    await this.page.goto('/',{waitUntil:'networkidle'} );
  }
  async acceptCookies(){
    await this.expectAndClick(this.allowCookiesBtnOld,'Accept Cookies');
  }
  async _waitForWidget() {
    await this.page.waitForSelector('#xl_widget iframe', { state: 'attached', timeout: 20000 });
    // give the embedded app time to boot/render
    await this.page.waitForLoadState('networkidle');
  }
  async doLogin(username,password) {
    // await this.expectAndClick(this.profileLogIn,'Login Link');
   await this.expectAndClick(
  {
    default: this.profileLogIn,
    Tablet:  this.profileLogIn,
    Mobile:  this.profileLogIn,
  },
  'Login Button'
);
    await this.waitAndFill(this.emailTxt,username,'Email');
    await this.waitAndFill(this.passwordTxt, password,'Password');
    await this.expectAndClick(this.loginBtn,'Login Button');
    await this.assert({locator: this.profileLoggedIn,state: 'visible',alias:'Profile Icon'} );
  }
async globalLogin(email, password) {
  await this.allowCookiesBtnOld.click();
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await this.profileLogIn.click();
      await this._waitForWidget();
      await expect(this.emailTxt).toBeVisible({ timeout: 10000 });
      break; // success → exit loop
    } catch (error) {
      if (attempt === 2) throw error; // fail after 2 attempts
      console.log('Retrying login…');
      await this.page.reload();
    }
  }

  await this.emailTxt.fill(email);
  await this.passwordTxt.fill(password);
  await this.loginBtn.click();
}

  async assertLoggedIn(){
    await this.assert({locator: this.profileLoggedIn,state: 'visible',alias:'Profile Icon'} );
  }

   async ariticlePage(){
    await this.expectAndClick(this.articleMenuOld,'Article Menu');
    await this.expectAndClick(this.allArticlesSubMenuOld,'All Articles Sub Menu');
    // await this.expectAndClick(this.allArticlesSubMenuOld,'All Articles Sub Menu',{
    //   apiSlug: 'articles/hollow-knight-silksong-s-steam-score-drops-over-poor-chinese-localization',
    //   method: 'GET'
    // });
  }
}

