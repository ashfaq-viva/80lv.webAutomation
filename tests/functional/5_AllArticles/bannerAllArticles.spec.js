import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('All Articles banner', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_046:Successful Big Image Banner visbility and redirection @regression`, async ({ page, loginPage , menubarPage, bigImageBannerPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToAllArticles();
      await bigImageBannerPage.bannerVisibilityAndRedirection('allArticles/allArticlesBigImageBanner'); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_047:Successful redirection on all sponsored tag present @regression`, async ({ page, loginPage ,sponsoredTagPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage); 
      await sponsoredTagPage.clickAllSponsoredTagsAndAssertTabs(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_061:Articles middle banner visibility and redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.middleBannerVisibilityAndRedirection();
    });
  }
})