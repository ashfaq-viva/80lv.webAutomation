import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Articles promo banner', () => {
  
  // for (const vp of [Desktop]) {
  //   test(`${vp.name} TC_076:Article page Bottom promo banner visibility with redirection @regression`, async ({ page, loginPage , promoImageBannerPage}) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit(config.slug.allArticlesPage);
  //     await promoImageBannerPage.footerPromoImageBannerRedirection('allArticles/footerPromoBanner'); 
  //   });
  // }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_067:Article page right side promo banner visibility with redirection @regression`, async ({ page, loginPage , promoImageBannerPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await promoImageBannerPage.rightSidePromoImageBannerRedirection('allArticles/allArticlesRightSidePromImageBanner'); 
    });
  }
});