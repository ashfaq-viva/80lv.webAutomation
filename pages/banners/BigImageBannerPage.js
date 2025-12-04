import { Desktop } from '../../utils/viewports.js';
import BasePage from '../BasePage.js';

export class BigImageBannerPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.bigImagebanner = page.locator('#Big_Image_bner');
    this.artcleArrowBtn = page.locator('div').filter({ hasText: /^Articles$/ }).getByRole('img');
  }
async bannerVisibilityAndRedirection(folderRoute) {
  const locator = this.artcleArrowBtn; // your locator
  try {
    // Check if the element is visible and enabled
    if (await locator.isVisible() && await locator.isEnabled()) {
      await this.expectAndClick({ Desktop: locator }, 'Articles Arrow Button');
      console.log('Clicked the Articles Arrow Button');
    } else {
      console.log('Articles Arrow Button not clickable, skipping...');
    }
  } catch (err) {
    console.log('Error checking or clicking the element, skipping...', err);
  }
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
async bannerVisibilityAndRedirectionWithoutMenuOpened(folderRoute) {
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
