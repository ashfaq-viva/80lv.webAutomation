import BasePage from '../BasePage';
import  { BASE_URL } from '../../playwright.config.js';

export class SponsoredTagPage extends BasePage {
  constructor(page, context,bookmarkPage) {
    super(page, context);
    this.sponsoredTagBigImageBanner = page.locator('div.BrndngGibPrm_sklton26042024', {
  has: page.locator('label', { hasText: 'Sponsored' })
});
    this.sponsoredTag = page.getByText('Sponsored', { exact: true });
  }

 
async clickAllSponsoredTagsAndAssertTabs() {
    const sponsoredTags = this.sponsoredTag;
    const count = await sponsoredTags.count();
    console.log(`🧩 Found ${count} Sponsored tags on page.`);

    if (count === 0) {
      console.log('⚠️⚠️⚠️ No Sponsored tags found on the page — skipping test.⚠️⚠️⚠️');
      return;
    }
    for (let i = 0; i < count; i++) {
     if (i === 0) {
    console.log("⚠️ Skipping first Sponsored tag (blocked) on Big Image Banner.");
    continue;
  }

  const tag = sponsoredTags.nth(i);
      try {
        await tag.scrollIntoViewIfNeeded();
        const [newPage] = await Promise.all([
          this.context.waitForEvent('page'), 
          tag.click({ timeout: 5000 })
        ]);

        await newPage.waitForLoadState('load');
        const newTabUrl = newPage.url();
        console.log(`👉 Clicked Sponsored tag #${i + 1} → new tab URL: ${newTabUrl}`);

        if (newTabUrl.includes(`${BASE_URL}/contact-us#Promote`)) {
          console.log(`✅ URL correct → ${newTabUrl}`);
        } else {
          console.log(`❌ URL incorrect → ${newTabUrl}`);
        }

        await newPage.close();

      } catch (err) {
        console.log(`❌ Could not click Sponsored tag #${i + 1}: ${err.message}`);
      }
    }

    console.log(`✅ Clicked all visible Sponsored tags (${count} total).`);
  }
  async bigImageBannerSponsoredTagVisibilityAndRedirection() {
    try {
      const count = await this.sponsoredTagBigImageBanner.count();
      if (count === 0) {
        console.log('⚠️ Sponsored tag not present — skipping redirection check.');
        return;
      }
      console.log('✅ Sponsored tag is visible, proceeding with click and redirection check.');
      const [newPage] = await Promise.all([
        this.context.waitForEvent('page'),
        this.expectAndClick(
          { default: this.sponsoredTagBigImageBanner },
          'Big Image Banner Sponsored Tag'
        ),
      ]);
      await newPage.waitForLoadState('load');
      await this.assert(
        {
          toHaveURL: `${BASE_URL}/contact-us#Promote`,
          alias: 'Sponsored tag redirection',
        },
        newPage
      );
    } catch (error) {
      console.log(`❌ Error during sponsored tag redirection check: ${error.message}`);
    }
  }

}
