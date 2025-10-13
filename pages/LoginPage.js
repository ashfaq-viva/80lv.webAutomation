import { expect } from '@playwright/test';
import BasePage from './BasePage';
import { config } from '../config/testConfig.js';
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
    this.profileLogInOld = page.getByRole('img', { name: 'profile-login' });
    this.navbarThreeDotMenuOld =  page.getByRole('button', { name: 'Menu' });
    this.profileLoggedInOld = page.locator(`text=${config.credentials.talentEmail}`);
    this.profileLoggedInResponsive = page.getByRole('link', { name: 'profile-loggedin Profile' })
  }

  async visit() {
    await this.page.goto('/',{waitUntil:'networkidle'} );
  }
  async acceptCookies(){
    await this.expectAndClick(this.allowCookiesBtnOld,'Accept Cookies','cookieApi:GET');
  }
  async _waitForWidget() {
    for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await this.profileLogIn.click();
      await this.page.waitForSelector('#xl_widget iframe', { state: 'attached', timeout: 5000 });
      break; 
    } catch (error) {
      if (attempt === 3) throw error; 
      console.log('Retrying widget…');
      await this.page.reload();
    }
  }
  }
  async doLogin(username,password) {
   await this.expectAndClick(
  {
    default: this.profileLogIn,
    Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
    Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
    Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
  },
  'Login Button','loginApi:POST'
);
    await this.waitAndFill(this.emailTxt,username,'Email');
    await this.waitAndFill(this.passwordTxt, password,'Password');
    await this.expectAndClick(this.loginBtn,'Login Button','loginApi:POST');
    await this.assert({
        locator: {
          default: this.profileLoggedIn,
          Laptop: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
          Tablet: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
          Mobile: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
        },
        state: 'visible',
        alias: 'Logged-in Profile Icon'
      });
  }
async globalLogin(email, password) {
  if (await this.allowCookiesBtnOld.isVisible().catch(() => false)) {
    await this.allowCookiesBtnOld.click();
    console.log("Cookies accepted.");
  } else {
    console.log("No cookies banner found, skipping...");
  }
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await this.profileLogIn.click();
      console.log("Login widget opened.");
      await expect(this.emailTxt).toBeVisible({timeout: 5000});
      console.log("Email Field is visible.");
      break; 
    } catch (error) {
      if (attempt === 4) throw error; 
      console.log('Retrying login…');
      await this.page.reload();
    }
  }

  await this.emailTxt.fill(email);
  console.log("Email entered.");
  await this.passwordTxt.fill(password);
  console.log("Password entered.");
  await this.loginBtn.click();
  console.log("Login button clicked.");
}

  async assertLoggedIn(){
     await this.assert({
        locator: {
          Desktop: this.profileLoggedIn,
          Laptop: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
          Tablet: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
          Mobile: [this.navbarThreeDotMenuOld, this.profileLogInOldResponsive],
        },
        state: 'visible',
        alias: 'Logged-in Profile Icon'
      });
  }
}

