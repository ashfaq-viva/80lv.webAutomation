import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { NavbarPage} from "../pages/NavbarPage.js";
import { SignupPage } from "../pages/SignupPage.js";


export const test = baseTest.extend({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  signupPage: async ({ page, context ,loginPage}, use) => {
    await use(new SignupPage(page, context , loginPage));
  },
   navbarPage: async ({ page, context , loginPage }, use) => {
    await use(new NavbarPage(page, context , loginPage));
  },
});


