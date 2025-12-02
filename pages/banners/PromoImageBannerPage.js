import BasePage from '../BasePage.js';

export class PromoImageBannerPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.footerPromoImageBanner1 = page.locator('#Image_benr_Bot1');
    this.footerPromoImageBanner2 = page.locator('#Image_benr_Bot2');
    this.rightSidePromoImageBanner1 = page.locator('#Image_bner_Mid1');
    this.rightSidePromoImageBanner2 = page.locator('#Image_bner_Mid2');
    this.footerSponsoredBannerLinks = this.page.locator("//div[contains(@class,'ImgPrmo26042024_default')][.//label[normalize-space()='Sponsored']]//a");
  }

  async clickSponsoredBannersIfPresent() {
  const count = await this.sponsoredBanners.count();
  if (count === 0) {
    console.log("⚠️ No Sponsored banners found. Skipping...");
    return;
  }

  for (let i = 0; i < count; i++) {
    const banner = this.footerSponsoredBanners.nth(i);
    const href = await banner.locator("a").getAttribute("href");
    console.log(`🖱️ Clicking Sponsored Banner #${i + 1}: ${href}`);
    await banner.locator("a").click();
    await this.page.waitForTimeout(2000);
  }
}
 async footerPromoImageBannerRedirection(folderRoute) {
  const banners = [
    { locator: this.footerPromoImageBanner1, name: 'Footer Promo Image Banner 1' },
    { locator: this.footerPromoImageBanner2, name: 'Footer Promo Image Banner 2' },
  ];

  for (let i = 0; i < banners.length; i++) {
    const { locator, name } = banners[i];
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick({ default: locator }, name),
    ]);

    await newPage.waitForLoadState('load');
    const newPageUrl = newPage.url();
    console.log(`🌐 Captured ${name} Redirection URL:`, newPageUrl);
    const filePath = await this.createSavedFile(
      folderRoute,
      `PromoImageBanner${i + 1}`,
      'txt',
      newPageUrl
    );
    console.log(`�️ ${name} redirection URL saved at: ${filePath}`);
    await newPage.close();
  }
}
 async rightSidePromoImageBannerRedirection(folderRoute) {
  const banners = [
    { locator: this.rightSidePromoImageBanner1, name: 'Right side Promo Image Banner 1' },
    { locator: this.rightSidePromoImageBanner2, name: 'Right side Promo Image Banner 2' },
  ];

  for (let i = 0; i < banners.length; i++) {
    const { locator, name } = banners[i];
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick({ default: locator }, name),
    ]);
    await newPage.waitForLoadState('load');
    const newPageUrl = newPage.url();
    console.log(`🌐 Captured ${name} Redirection URL:`, newPageUrl);
    const filePath = await this.createSavedFile(
      folderRoute,
      `PromoImageBanner${i + 1}`,
      'txt',
      newPageUrl
    );
    console.log(`🗂️ ${name} redirection URL saved at: ${filePath}`);
    await newPage.close();
  }
}

}
