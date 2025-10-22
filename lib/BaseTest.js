import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { NavbarPage} from "../pages/NavbarPage.js";
import { SignupPage } from "../pages/SignupPage.js";
import { MenubarPage } from "../pages/MenubarPage.js";
import { AllArticlesPage } from "../pages/AllArticlesPage.js";


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
  menubarPage: async ({ page, context , loginPage }, use) => {
    await use(new MenubarPage(page, context , loginPage));
  },
  allArticlesPage: async ({ page, context , loginPage ,menubarPage}, use) => {
    await use(new AllArticlesPage(page, context , loginPage ,menubarPage));
  },
});