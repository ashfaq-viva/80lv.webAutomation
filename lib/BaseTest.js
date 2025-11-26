import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { NavbarPage} from "../pages/NavbarPage.js";
import { SignupPage } from "../pages/SignupPage.js";
import { MenubarPage } from "../pages/MenubarPage.js";
import { AllArticlesPage } from "../pages/AllArticlesPage.js";
import { TalentPage } from "../pages/TalentPage.js"
import { BookmarkPage } from "../pages/BookmarkPage.js";
import { SubscribeFormFooterPage } from "../pages/SubscribeFormFooterPage.js";
import { SponsoredTagPage } from "../pages//banners/SponsoredTagPage.js";
import { PromoImageBannerPage } from "../pages/banners/PromoImageBannerPage.js";
import { EventsPage } from "../pages/EventsPage.js";
import { BigImageBannerPage } from "../pages/banners/BigImageBannerPage.js";



export const test = baseTest.extend({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  signupPage: async ({ page, context ,loginPage}, use) => {
    await use(new SignupPage(page, context , loginPage));
  },
   navbarPage: async ({ page, context , loginPage ,bookmarkPage}, use) => {
    await use(new NavbarPage(page, context , loginPage, bookmarkPage));
  },
  menubarPage: async ({ page, context , loginPage ,talentPage}, use) => {
    await use(new MenubarPage(page, context , loginPage,talentPage));
  },
  bigImageBannerPage: async ({ page, context}, use) => {
    await use(new BigImageBannerPage(page, context));
  },
  allArticlesPage: async ({ page, context , loginPage ,menubarPage ,navbarPage,bookmarkPage ,subscribeFormFooterPage,sponsoredTagPage,promoImageBannerPage,bigImageBannerPage}, use) => {
    await use(new AllArticlesPage(page, context , loginPage ,menubarPage ,navbarPage, bookmarkPage ,subscribeFormFooterPage,sponsoredTagPage,promoImageBannerPage,bigImageBannerPage));
  },
  talentPage: async ({ page, context , loginPage}, use) => {
    await use(new TalentPage(page, context , loginPage));
  },
  bookmarkPage: async ({ page, context , loginPage}, use) => {
    await use(new BookmarkPage(page, context , loginPage));
  },
  subscribeFormFooterPage: async ({ page, context , loginPage}, use) => {
    await use(new SubscribeFormFooterPage(page, context , loginPage));
  },
  sponsoredTagPage: async ({ page, context , loginPage}, use) => {
    await use(new SponsoredTagPage(page, context , loginPage));
  },
  promoImageBannerPage: async ({ page, context , loginPage}, use) => {
    await use(new PromoImageBannerPage(page, context , loginPage));
  },
  eventsPage: async ({ page, context , loginPage,bigImageBannerPage,sponsoredTagPage,menubarPage,promoImageBannerPage,subscribeFormFooterPage}, use) => {
    await use(new EventsPage(page, context , loginPage,bigImageBannerPage,sponsoredTagPage,menubarPage,promoImageBannerPage,subscribeFormFooterPage));
  }
});