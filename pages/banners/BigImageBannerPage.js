import BasePage from '../BasePage.js';

export class BigImageBannerPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.bigImagebanner = page.locator('#Big_Image_bner');
  }
async bannerVisibilityAndRedirection(folderRoute) {
  try {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), // listens for new page
      this.expectAndClick({ default: this.bigImagebanner }, 'Big Image Banner')
    ]);
    await newPage.waitForLoadState('load');
    const newPageUrl = newPage.url();
    console.log("🌐 Captured Banner Redirection URL:", newPageUrl);
    const filePath = await this.createSavedFile(
      folderRoute,
      'BigImageBannner',
      'txt',
      newPageUrl
    );
    console.log(`🗂️ Banner redirection URL saved at: ${filePath}`);
    await newPage.close();
  } catch (error) {
    console.log("❌ Error during banner redirection check:", error.message);
  }
}
  
}
