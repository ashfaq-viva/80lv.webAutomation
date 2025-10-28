import BasePage from './BasePage';
import { config } from '../config/testConfig.js';
export class LoginPage extends BasePage {
  constructor(page, context) {
    super(page, context);
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
    this.loginWithFacebookBtn = this.widgetFrame.getByTestId('login-form__primary-social--facebook');
    this.loginWithXsollaBtn = this.widgetFrame.getByTestId('login-form__primary-social--babka');
    this.loginWithTwitterBtn = this.widgetFrame.getByTestId('login-form__secondary-social--twitter');
    this.loginWithTwitterPrimaryBtn = this.widgetFrame.getByTestId('login-form__primary-social--twitter');
    this.loginWithGoogleBtn = this.widgetFrame.getByTestId('login-form__secondary-social--google');
    this.loginWithGooglePrimaryBtn = this.widgetFrame.getByTestId('login-form__primary-social--google');
    this.loginWithLinkdinBtn = this.widgetFrame.getByTestId('login-form__secondary-social--linkedin');
    this.loginWithLinkdinPrimaryBtn = this.widgetFrame.getByTestId('login-form__primary-social--linkedin');
}

  async visit(slugKeyOrPath = '') {
    let path = '';
    if (config.slug[slugKeyOrPath]) {
      path = config.slug[slugKeyOrPath];
    } else {
      path = slugKeyOrPath;
    }
    const finalPath = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(finalPath, { waitUntil: 'networkidle' });
  }
  async acceptCookies(){
    await this.expectAndClick(this.allowCookiesBtnOld,'Accept Cookies');
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
  async globalLogin(email, password) {
    try {
      await this.allowCookiesBtnOld.waitFor({ state: 'visible', timeout: 3000 });
      await this.allowCookiesBtnOld.click();
      console.log("Cookies accepted.");
    } catch {
      console.log("No cookie popup detected.Skipping...");
    }
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        await this.profileLogIn.click();
        console.log("Login widget opened.");
        await this.emailTxt.waitFor({ state: 'visible', timeout: 5000 });
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
  async loginWithFacebook(){
    await this.expectAndClick({
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
      },
      'Login Button','loginApi:POST');
    await this.expectAndClick(this.loginWithFacebookBtn,'Login with facebook button');
    await this.assert({
    toHaveURL: /facebook\.com\/login\.php/,
    alias: 'Facebook OAuth Redirect'
});
  }

  async loginWithXsolla(){
    await this.expectAndClick({
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
      },
      'Login Button','loginApi:POST');
    await this.expectAndClick(this.loginWithXsollaBtn,'Login with xsolla button');
    await this.assert({
      toHaveURL: /wallet\.xsolla\.com\/oauth2\/profile/,
      alias: 'Xsolla Wallet OAuth Redirect'
    });
  }
  async loginWithGoogle(){
    await this.expectAndClick({
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
      },
      'Login Button','loginApi:POST');
      try {
      await this.expectAndClick(this.loginWithGoogleBtn, 'Login with Google button');
      } catch (error) {
      await this.expectAndClick(this.loginWithGooglePrimaryBtn, 'Login with Google Primary button');
      }
      await this.assert({
      toHaveURL: /accounts\.google\.com\/v3\/signin\/identifier/,
      alias: 'Google OAuth Redirect'
    });
  }
  async loginWithLinkdIn(){
    await this.expectAndClick({
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
      },
      'Login Button','loginApi:POST');
      try {
      await this.expectAndClick(this.loginWithLinkdinBtn, 'Login with LinkdIn button');
      } catch (error) {
      await this.expectAndClick(this.loginWithLinkdinPrimaryBtn, 'Login with LinkdIn Primary button');
      }
      await this.assert({
        toHaveURL: /linkedin\.com\/uas\/login/,
        alias: 'LinkedIn OAuth Redirect'
      });
  }
  async loginWithTwitter(){
    await this.expectAndClick({
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld,this.profileLogInOld],
      },
      'Login Button','loginApi:POST');
      try {
      await this.expectAndClick(this.loginWithTwitterBtn, 'Login with Xsolla button');
      } catch (error) {
      await this.expectAndClick(this.loginWithTwitterPrimaryBtn, 'Login with Xsolla Primary button');
      }
  }
  async assertLoginModalVisibility(){
     await this.assert({
        locator: this.emailTxt,
        state: 'visible',
        alias: 'Login Modal Widget'
      });
  }  
}

