import BasePage from './BasePage';
import { generateRandomUser } from "../utils/generateRandomUser.js";
import dotenv from "dotenv";
import { getLatestEmailDetailsUnified } from "../utils/sigupUtils.js";
import { getViewportNameFromPage } from '../utils/viewports.js';
import fs from 'fs';
import path from 'path';
dotenv.config();

export class SignupPage extends BasePage {
  constructor(page , context, loginPage) {
    super(page, context);
    this.loginPage = loginPage;
    this.loginBtn = page.getByText("LogIn");
    this.frame = page.frameLocator("#xl_widget iframe");
    this.signUpBtn = this.frame.getByTestId("signUp_tab-link");
    this.emailInput = this.frame.getByTestId("sign-up-form__fields-email");
    this.passwordInput = this.frame.getByTestId("sign-up-form__fields-password");
    this.createAccountBtn = this.frame.getByTestId("sign-up-form__button-submit");
    this.profileLoggedIn = page.getByRole('img', { name: 'profile_loggedin' });
  }

  async createAccount(userModel) {
    await this.expectAndClick(
      {
        default: this.loginBtn,
        Laptop:  [this.loginPage.navbarThreeDotMenuOld,this.loginPage.profileLogInOld],
        Tablet:  [this.loginPage.navbarThreeDotMenuOld,this.loginPage.profileLogInOld],
        Mobile:  [this.loginPage.navbarThreeDotMenuOld,this.loginPage.profileLogInOld],
      },
      'Login Button','loginApi:POST'
    );
    await this.signUpBtn.click(); 
    await this.waitAndFill(this.emailInput,userModel,'Email');
    await this.waitAndFill(this.passwordInput, userModel,'Password');
    await this.expectAndClick(this.createAccountBtn,'Create Account Button');
    await this.page.waitForTimeout(5000); 
  }
  async storeEmail(userModel) {
    this.generatedEmail = userModel.email;
    console.log("Generated Signup Email:", this.generatedEmail);
    const viewportName = getViewportNameFromPage(this.page);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `signup_email_${viewportName}_${timestamp}.txt`;
    const filePath = path.join(process.cwd(), 'savedData/signupEmails', fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.appendFileSync(filePath, `Email: ${this.generatedEmail}\n`, 'utf8');
    console.log(`✅ Email saved to: ${filePath}`);
}
  async doSignup(request){
    const userModel = generateRandomUser();
    await this.storeEmail(userModel);
    await this.createAccount(userModel);
    const { link } = await getLatestEmailDetailsUnified({request});
    await this.page.goto(link);
    await this.assert({
        locator: {
          default: this.loginBtn.profileLoggedIn,
          Laptop: [this.loginPage.navbarThreeDotMenuOld, this.loginPage.profileLogInOldResponsive],
          Tablet: [this.loginPage.navbarThreeDotMenuOld, this.loginPage.profileLogInOldResponsive],
          Mobile: [this.loginPage.navbarThreeDotMenuOld, this.loginPage.profileLogInOldResponsive],
        },
        state: 'visible',
        alias: 'Logged-in Profile Icon'
      });
  }
}