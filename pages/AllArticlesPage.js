import BasePage from './BasePage';
import { expect } from '@playwright/test';
import { getViewportNameFromPage } from '../utils/viewports.js';
import { config } from '../config/testConfig.js';
import  { BASE_URL } from '../playwright.config.js';

export class AllArticlesPage extends BasePage {
  constructor(page, context,bookmarkPage) {
    super(page, context);
    this.page = page;
    this.bookmarkPage = bookmarkPage;
    this.filterField = page.getByRole('button', { name: 'Category' });
    this.filterAllArticlesBtn = page.getByRole('button', { name: 'All Articles' });
    this.filterOptionNews = page.locator('label').filter({ hasText: 'News' });
    this.filterChipNews = page.getByRole('main').getByText('News', { exact: true });
    this.filterOptionInterviews = page.locator('label').filter({ hasText: 'Interviews' });  
    this.filterChipInterviews = page.getByRole('main').getByText('Interviews', { exact: true });
    this.filterOptionVfx = page.locator('label').filter({ hasText: 'VFX' });  
    this.filterChipVfx = page.getByRole('main').getByText('VFX', { exact: true });
    this.filterOptionEnvironmentArt = page.locator('label').filter({ hasText: 'Environment Art' });  
    this.filterChipEnvironmentArt = page.getByRole('main').getByText('Environment Art', { exact: true });
    this.filterOptionCharacterArt = page.locator('label').filter({ hasText: 'Character Art' });  
    this.filterChipCharacterArt = page.getByRole('main').getByText('Character Art', { exact: true });
    this.filterOptionRatings = page.locator('label').filter({ hasText: 'Ratings' });  
    this.filterChipRatings = page.getByRole('main').getByText('Ratings', { exact: true });
    this.filterOptionResearch = page.locator('label').filter({ hasText: 'Research' });  
    this.filterChipResearch = page.getByRole('main').getByText('Research', { exact: true });
    this.filterOptionProps = page.locator('label').filter({ hasText: 'Props' });  
    this.filterChipProps = page.getByRole('main').getByText('Props', { exact: true });
    this.filterOptionTech = page.locator('label').filter({ hasText: 'Tech' });  
    this.filterChipTech = page.getByRole('main').getByText('Tech', { exact: true });
    this.filterOptionPromo = page.locator('label').filter({ hasText: 'Promo' });  
    this.filterChipPromo = page.getByRole('main').getByText('Promo', { exact: true });
    this.filterOptionMarketplace = page.locator('label').filter({ hasText: 'Marketplace' });  
    this.filterChipMarketplace = page.getByRole('main').getByText('Marketplace', { exact: true });
    this.filterOptionSculpting = page.locator('label').filter({ hasText: 'Sculpting' });  
    this.filterChipSculpting = page.getByRole('main').getByText('Sculpting', { exact: true });
    this.bigImagebanner = page.locator('#Big_Image_bner');
    this.middlebanner = page.locator(`
                                      a[style*="--metasite-button-bg-color"],
                                      a[style*="--metasite-button-text-color"],
                                      a[style*="--metasite-bg-image"]
                                    `);
    this.popularBtn= page.getByRole('button', { name: 'Popular' });
    this.newBtn = page.getByRole('button', { name: 'New' });
    this.articleBookmarks = page.locator('div[data-tip="true"]');
    this.tooltip = page.locator('[data-id="tooltip"]:visible');
    this.articleAllCardContent = "//div[a/h1][1]";
    this.articleCard1stImage = page.locator('a[href*="/articles/"] img[src*="/upload/post/"]').first();
    this.paginationLeftArrow = page.locator('a._3TaHD._2rZK8.Z1hkO >> svg');
    this.paginationRightArrow = page.locator('a._3TaHD._2rZK8 >> svg');
    this.paginationRightArrow2 = page.locator('a._3TaHD._2rZK8 >> svg').nth(2);
    this.pagination2Btn = page.getByRole('listitem').filter({ hasText: '2' });
    this.pagination3Btn = page.getByRole('listitem').filter({ hasText: '3' });
    this.afterPaginationlistLastNumberBtn = page.locator('ul > li:nth-child(4)').first();
    this.paginationlistLastBtnWhenli7 = page.locator('ul > li:nth-child(7)');
    this.sponsoredTag = page.getByText('Sponsored', { exact: true });
    this.newsletterEmailField = page.getByRole('textbox', { name: 'Email address' });
    this.newsletterSubmitBtn = page.getByRole('main').locator('#subscribe-form div').nth(1);
    this.newsletterSuccessTxt = page.getByRole('heading', { name: 'Thank you for subscription' });
    this.newsletterErrorTxt = page.getByText('Error', { exact: true });
    this.jobBoardAllVacancies = page.locator('div').filter({ hasText: /^All vacancies$/ }).getByRole('img');  
    this.partnersExplorePartnersBtn = page.getByRole('link', { name: 'arrow Explore Partners' });
    this.partnersBecomeAPartnerBtn =  page.getByRole('link', { name: 'arrow Become a partner arrow' });  
    this.partnersSliderLeftArrow = page.getByRole('button', { name: 'Previous slide' }); 
    this.partnersSliderRightArrow = page.getByRole('button', { name: 'Next slide' });  
    this.partnerLinks = this.page.locator('.swiper-wrapper > a');  
    this.resetFiltersBtn = page.getByRole('button', { name: 'Reset filters' });    
    this.articlePageTitleH1 = page.locator('h1').nth(0);
  }

  async bannerVisibilityAndRedirection() {
  try {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), // listens for new page
      this.expectAndClick({ default: this.bigImagebanner }, 'Big Image Banner')
    ]);
    await newPage.waitForLoadState('load');
    const newPageUrl = newPage.url();
    console.log("🌐 Captured Banner Redirection URL:", newPageUrl);
    const filePath = await this.createSavedFile(
      'allArticles/allArticlesBigImageBanner',
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
  async popularButtonResult(){
      await this.expectAndClick( this.popularBtn,'Popular Button','articlePopularListPage1Api:GET',{detectApi: "articlePopularListPage1Api",saveApiResponse: true,saveFileName: "allArticles/GETPopularListPage1"});
      await this.assertDataFromResponseBody('allArticles/GETPopularListPage1','items.title');
  }
  async newButtonResult(){
      this.popularButtonResult();
      await this.expectAndClick( this.newBtn,'New Button');
  }
  async bookmarkArticle(){
    await this.bookmarkLocator('articleCard1bookmark','max','Article Card 1 Bookmark');
  }
  async bookmarkLocator(locatorName, position = "max", alias = "") {
  const locator = this.articleBookmarks;
  const handles = await locator.elementHandles();
  const bookmarkMap = [];
  for (const handle of handles) {
    const dataFor = await handle.getAttribute("data-for");
    if (!dataFor) continue;
    const match = dataFor.match(/add-bookmark-(\d+)/);
    if (match) {
      bookmarkMap.push({ num: parseInt(match[1], 10), handle });
    }
  }
  if (bookmarkMap.length === 0) {
    console.warn(`⚠️ No bookmarks found for locator: ${locatorName}`);
    return;
  }
  bookmarkMap.sort((a, b) => b.num - a.num);
  let index = 0;
  if (position.startsWith("max")) {
    const offset = parseInt(position.split("-")[1] || "0", 10);
    index = offset;
  } else if (!isNaN(position)) {
    index = parseInt(position, 10);
  }

  const chosen = bookmarkMap[index];
  if (!chosen) {
    console.warn(`⚠️ No bookmark found for position: ${position}`);
    return;
  }
  const bookmarkId = chosen.num;
  await chosen.handle.hover();
  console.log(`🖱️ Hovered on ${locatorName} (${position}) [id=${bookmarkId}] ${alias ? `[alias: ${alias}]` : ""}`);
  await this.tooltip.waitFor({ state: "visible" });
  await chosen.handle.click();
  console.log(`✅ Clicked ${locatorName} (${position}) [id=${bookmarkId}] ${alias ? `[alias: ${alias}]` : ""}`);
}


async clickBookmarkByPosition(locatorName, position = "max") {
  const locator = this.articleBookmarks; // single locator for all
  const handles = await locator.elementHandles();
  const bookmarkMap = [];

  for (const handle of handles) {
    const dataFor = await handle.getAttribute("data-for");
    if (!dataFor) continue;
    const match = dataFor.match(/add-bookmark-(\d+)/);
    if (match) bookmarkMap.push({ num: parseInt(match[1], 10), handle });
  }

  if (bookmarkMap.length === 0) {
    console.warn(`⚠️ No bookmarks found for locator: ${locatorName}`);
    return;
  }

  // ✅ KEEP DOM ORDER (no sorting) so index 0 = first card in UI
  let index = 0;

  // "max" or default → first element (index 0)
  if (position === "max") {
    index = 0;
  }
  // allow "max-1", "max-2", etc. → second, third, ...
  else if (position.startsWith("max-")) {
    index = parseInt(position.split("-")[1] || "0", 10);
  }

  const chosen = bookmarkMap[index];

  if (!chosen) {
    console.warn(`⚠️ No bookmark found for position: ${position}`);
    return;
  }

  const bookmarkId = chosen.num;
  const dataForSelector = `[data-for="add-bookmark-${bookmarkId}"]`;

  await chosen.handle.hover();
  console.log(`🖱️ Hovered on ${locatorName} (${position}) [id=${bookmarkId}].`);
  await this.tooltip.waitFor({ state: 'visible' });
  let tooltipText = (await this.tooltip.textContent()) || '';

  if (tooltipText.includes('Add bookmark')) {
    await this.assert({
      locator: this.tooltip,
      text: 'Add bookmark',
      state: 'visible',
      alias: 'Add Bookmark Tooltip'
    });
    await chosen.handle.click();
    console.log(`✅ ${locatorName} [${bookmarkId}] → Bookmark added.`);
    return;
  }

  if (tooltipText.includes('Remove bookmark')) {
    await this.assert({
      locator: this.tooltip,
      text: 'Remove bookmark',
      state: 'visible',
      alias: 'Remove Bookmark Tooltip'
    });
    console.log(`🗑️ ${locatorName} [${bookmarkId}] → Clicking to remove...`);
    const removeResponsePromise = this.page.waitForResponse(
      resp => resp.url().includes('/bookmark/delete/') && resp.status() === 200,
      { timeout: 5000 }
    ).catch(() => null);

    await Promise.all([
      chosen.handle.click(),
      removeResponsePromise
    ]);
    console.log(`🗑️ ${locatorName} [${bookmarkId}] → Remove clicked (response awaited).`);

    const reselectLocator = this.page.locator(dataForSelector);
    try {
      await this.page.waitForFunction(
        selector => {
          const el = document.querySelector('.tooltip');
          return !!el && el.textContent && el.textContent.includes('Add bookmark');
        },
        dataForSelector,
        { timeout: 5000 }
      );
    } catch (e) {
      await this.page.waitForTimeout(500);
    }

    let readded = false;
    for (let attempt = 0; attempt < 3 && !readded; attempt++) {
      const freshElem = await reselectLocator.elementHandle();
      if (!freshElem) {
        const fallback = await this.page.locator('div[data-tip="true"]').filter({
          has: this.page.locator(
            `[data-for="add-bookmark-${bookmarkId}"], [data-for="remove-bookmark-${bookmarkId}"]`
          )
        }).elementHandle().catch(() => null);

        if (fallback) {
          await fallback.hover();
          await this.tooltip.waitFor({ state: 'visible' }).catch(() => {});
          tooltipText = (await this.tooltip.textContent()) || '';
          if (tooltipText.includes('Add bookmark')) {
            await fallback.click();
            readded = true;
            console.log(`🔁 ${locatorName} [${bookmarkId}] → Bookmark re-added (fallback).`);
            break;
          }
        }
        await this.page.waitForTimeout(300);
        continue;
      }

      await freshElem.hover().catch(() => {});
      await this.tooltip.waitFor({ state: 'visible' }).catch(() => {});
      tooltipText = (await this.tooltip.textContent()) || '';

      if (tooltipText.includes('Add bookmark')) {
        await freshElem.click();
        readded = true;
        console.log(`🔁 ${locatorName} [${bookmarkId}] → Bookmark re-added.`);
      } else {
        await this.page.waitForTimeout(250);
      }
    }

    if (!readded) {
      console.warn(`⚠️ Could not re-add bookmark for ${locatorName} [${bookmarkId}] after retries.`);
    }
  } else {
    console.warn(`⚠️ Unexpected tooltip text: "${tooltipText}"`);
  }
}


  async bookmarkArticleWithLogin() {
    await this.clickBookmarkByPosition('articleCard1bookmark', 'max');
    await this.extractArticleCard1Details('allArticles/allArticleBookmarkedArticle','card1TC_054');
  }

  async extractArticleCard1Details(folderRoute,fileName) {
   const articleCards = this.page.locator("//div[a/h1]");
    const articleCard1st = articleCards.first();
    await this.extractDetailsAndSaveAsJson(
          articleCard1st,
          folderRoute,                   
          fileName,
          getViewportNameFromPage,                   
        );
  }
  async extractArticleAllCardDetails() {
    await this.extractDetailsAndSaveAsJson(
      this.articleAllCardContent,
      'allArticlesCard',                   
      'allcards',
      getViewportNameFromPage,                   
    );
  }
  async article1Redirection() {
  await this.extractArticleCard1Details('allArticles/allArticlesRedirectedArticle','card1TC_60');
  await this.expectAndClick(
    { default: this.articleCard1stImage },
    'Article card 1 Image'
  );
  await this.page.waitForLoadState('load');
  const newPageUrl = this.page.url();
  console.log("🌐 Captured Article Redirection URL:", newPageUrl);

  const filePath = await this.createSavedFile(
    'allArticles/articleCardRedirection',
    'card1Url',
    'txt',
    newPageUrl
  );
await this.extractDetailsAndSaveAsJson(
              this.articlePageTitleH1,
              'allArticles/articlePage',                   
              'TitleH1',
              getViewportNameFromPage, 
              { includeOwnText: true }                  
            );
   await this.assertFromSavedJsonToJsonData(
  { 'allArticles/allArticlesRedirectedArticle/card1TC_60': ['h1']},
  { 'allArticles/articlePage/TitleH1': ['h1']}
);
}
async middleBannerVisibilityAndRedirection() {
  try {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), // listens for new page
      this.expectAndClick({ default: this.middlebanner }, 'Middle Banner')
    ]);
    await newPage.waitForLoadState('load');
    const newPageUrl = newPage.url();
    console.log("🌐 Captured Middle Banner Redirection URL:", newPageUrl);
    const filePath = await this.createSavedFile(
      'allArticles/allArticlesMiddleBanner',
      'middleBannner',
      'txt',
      newPageUrl
    );
    console.log(`🗂️ Middle Banner redirection URL saved at: ${filePath}`);
    await newPage.close();
  } catch (error) {
    console.log("❌ Error during banner redirection check:", error.message);
  }
}
async paginationLeftArrowCheck() {
  await this.expectNotVisible(this.paginationLeftArrow,'Pagination Left Arrow Button');
  await this.expectAndClick( this.pagination2Btn,'Pagination 2 Button');
  await this.assert({
        locator: this.paginationLeftArrow,
        state: 'visible',
        alias: 'Pagination Left Arrow Button'
      });
      await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button '
      });
  await this.expectAndClick( this.paginationLeftArrow,'Pagination Left Arrow Button');
  await this.expectNotVisible(this.paginationLeftArrow,'Pagination Left Arrow Button');
  }
async paginationRightArrowCheck() {
  await this.expectAndClick( this.paginationRightArrow,'Pagination Right Arrow Button');
  await this.assert({
        locator: this.paginationLeftArrow,
        state: 'visible',
        alias: 'Pagination Left Arrow Button'
      });
  await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button '
      });
  }
  async newTabPagination(){
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.expectAndClick( this.newBtn,'New Button');
    await this.expectAndClick( this.pagination2Btn,'Pagination Right Arrow Button 2');
    await this.assert({
      locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button '
    });
    await this.expectAndClick( this.pagination3Btn,'Pagination Right Arrow Button 2');
    await this.assert({
      locator: this.pagination3Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 3 Button '
    })
  }
  async popularTabPagination(){
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.expectAndClick( this.pagination2Btn,'Pagination Right Arrow Button 2');
    await this.assert({
      locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button '
    });
    await this.expectAndClick( this.pagination3Btn,'Pagination Right Arrow Button 2');
    await this.assert({
      locator: this.pagination3Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 3 Button '
    })
  }
  async invalidSubscribeNewsletter() {
    await this.waitAndFill( this.newsletterEmailField,config.credentials.invalidEmail,'Invalid Email Address');
    await this.expectAndClick( this.newsletterSubmitBtn,'Newsletter Submit Button');
    await this.assert({
          locator: this.newsletterErrorTxt,
          state: 'visible',
          alias: 'Newsletter Error Text'
        });
  }
  async twoFiltersInPopularTabPagination(){
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.filterWithNewsAndInterviews();
    const paginationCount = await this.pagination2Btn.count();
      if (paginationCount > 0) {
      console.log('Pagination 2 Button is present, clicking it...');
      await this.pagination2Btn.click();
      await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button',
      });
    } else {
      console.log('Pagination 2 Button not present.');
    }
  }
  async singleFilterInPopularTabPagination(){
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.filterWithNews();
    const paginationCount = await this.pagination2Btn.count();
      if (paginationCount > 0) {
      console.log('Pagination 2 Button is present, clicking it...');
      await this.pagination2Btn.click();
      await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button',
      });
    } else {
      console.log('Pagination 2 Button not present.');
    }
  }
  async fiveFiltersInNewTabPagination(){
    await this.expectAndClick( this.newBtn,'New Button');
    await this.filterWithNewsInterviewsVfxMarketplaceSculpting();
    const paginationCount = await this.pagination2Btn.count();
      if (paginationCount > 0) {
      console.log('Pagination 2 Button is present, clicking it...');
      await this.pagination2Btn.click();
      await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button',
      });
    } else {
      console.log('Pagination 2 Button not present.');
    }
  }
  async fiveFiltersInPopularTabPagination(){
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.filterWithNewsInterviewsVfxMarketplaceSculpting();
    const paginationCount = await this.pagination2Btn.count();
      if (paginationCount > 0) {
      console.log('Pagination 2 Button is present, clicking it...');
      await this.pagination2Btn.click();
      await this.assert({
        locator: this.pagination2Btn,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button',
      });
    } else {
      console.log('Pagination 2 Button not present.');
    }
  }
  async validSubscribeNewsletter() {
    await this.waitAndFill( this.newsletterEmailField,config.credentials.talentEmail,'Valid Email Address');
    await this.expectAndClick( this.newsletterSubmitBtn,'Newsletter Submit Button','subscribeApi:POST');  
    await this.assert({
          locator: this.newsletterSuccessTxt,
          state: 'visible',
          alias: 'Newsletter Success Text'
        });
  }

async jobBoardJobsRedirection() {
  const jobBoardContainer = this.page
    .locator('//h2[text()="Job board"]/parent::div/following-sibling::div')
    .first();
  await jobBoardContainer.waitFor({ state: 'visible', timeout: 10000 });
  const jobCardsLocator = jobBoardContainer.locator('xpath=./div[.//h3]');

  const count = await jobCardsLocator.count();
  console.log(`🔍 Unique Job Cards Found: ${count}`);
  if (count === 0) return console.log('❌ No job cards found.');

  for (let i = 0; i < count; i++) {
    const jobLocator = jobCardsLocator.nth(i);
    const jobAlias = `Job Board ${i + 1} Job`;

    await this.expectAndClick(jobLocator, jobAlias);
    await this.page.waitForLoadState('networkidle');

    const url = this.page.url();
    console.log(`🌐 Captured ${jobAlias} → ${url}`);

    const filePath = await this.createSavedFile(
      'allArticles/allArticlesJobBoardJob',
      `jobBoard${i + 1}Job`,
      'txt',
      url
    );
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
    console.log('------------------------------------')
  }
}

async jobBoardAllVacanciesRedirection() {
  await this.expectAndClick(this.jobBoardAllVacancies, 'All Vacancies Link');
  await this.page.waitForLoadState('load');
  await this.assert({
        toHaveURL: `${BASE_URL}/jobs`,
        alias: 'Jobs Page'
      });
    }
 async sliderWidgetRightandLeft() {
  const clickCount = 8;

  for (let i = 1; i <= clickCount * 2; i++) {
    let arrow, direction, displayIndex;

    if (i <= clickCount) {
      arrow = this.partnersSliderRightArrow;
      direction = 'Right';
      displayIndex = i;
    } else {
      arrow = this.partnersSliderLeftArrow;
      direction = 'Left';
      displayIndex = i - clickCount;
    }

    console.log(`${direction === 'Right' ? '➡️' : '⬅️'} Clicking Partners Slider ${direction} Arrow - ${displayIndex}`);
    await this.expectAndClick(arrow, `Partners Slider ${direction} Arrow (${displayIndex})`);
    await this.page.waitForTimeout(300);
  }

  console.log("✅ Completed right and left slider navigation.");
}
 async partnerLinksRedirection() {
    const partnerLinks = this.page.locator('.swiper-wrapper > a');
    const total = await partnerLinks.count();
    console.log(`🧩 Total partner links found: ${total}`);
    const viewportName = getViewportNameFromPage(this.page);
    console.log(`🖥️ Current viewport: ${viewportName}`);

    for (let i = 0; i < total; i++) {
        const partner = partnerLinks.nth(i);
        await partner.scrollIntoViewIfNeeded();
        const href = await partner.getAttribute('href');
        console.log(`🖱️ Attempting to click Partner #${i + 1}: ${href}`);
        await this.page.evaluate((el) => el.click(), await partner.elementHandle());
        await this.page.waitForTimeout(2000); // allow navigation

        const newPageUrl = this.page.url();
        console.log(`🌐 Partner #${i + 1} URL: ${newPageUrl}`);
        const filePath = await this.createSavedFile(
            'allArticles/allArticlesPartnersLinks',
            'partnerLink' + (i + 1),
            'txt',
            newPageUrl
        );
        console.log(`🗂️ Partner redirection URL saved at: ${filePath}`);
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');

        if (viewportName === 'Desktop' && i < total - 1) {
            await this.expectAndClick(this.partnersSliderRightArrow, 'Partners Slider Right Arrow');
            await this.page.waitForTimeout(500);
        }
    }
}

  async partnersExploreButtonsRedirection() {
    await this.expectAndClick(this.partnersExplorePartnersBtn, 'Explore Partners Button');
    await this.assert({
          toHaveURL: `${BASE_URL}/partners`,
          alias: 'Partners Page'
        });
      }
  // async partnersBecomeAPartnerRedirection() {
  //   await this.expectAndClick(this.partnersBecomeAPartnerBtn, 'Become a Partner Button');
  //   }
  async partnersBecomeAPartnerRedirection() {
  // Wait for the "Become a partner" link to be visible
  const partnerLink = this.page.locator('a:has-text("Become a partner")');
  await partnerLink.waitFor({ state: 'visible' });

  // Get the href attribute
  const href = await partnerLink.getAttribute('href');
  const expectedPattern = /^mailto:contact@80\.lv$/;

  console.log(`Button "Become a partner" HREF:`, href);
  console.log(`Expected pattern: ${expectedPattern}`);

  if (!href) {
    console.warn(`❌ "Become a partner" href is empty`);
  } else {
    // Optionally save the href to a file
    const filePath = await this.createSavedFile(
      'events/buttonLinks',
      'BecomePartnerButtonLink',
      'txt',
      href
    );

    // Assertion
    expect(href).toMatch(expectedPattern);

    console.log(`   Actual:   ${href}`);
    console.log(`   Expected: ${expectedPattern}`);
    console.log(`✅ "Become a partner" href assertion passed`);
  }
}

  async filterAllArticleOption(){
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectAndClick(this.filterOptionNews, 'News Option');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.assert({
      locator: this.filterChipNews,
      state: 'visible',
      alias: 'News Filter Chip'
    });
    await this.expectAndClick(this.filterChipNews, 'News Filter Chip Removed');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectAndClick(this.filterAllArticlesBtn, 'All Articles Button');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectNotVisible(this.filterChipNews, 'News Filter Chip');
    await this.assert({
      toHaveURL:`${BASE_URL}/articles`,
      alias: 'All Articles Page URL after removing filter'
    });
  }
  async filterWithNews(){
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectAndClick(this.filterOptionNews, 'News Option');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.assert({
      locator: this.filterChipNews,
      state: 'visible',
      alias: 'News Filter Chip'
    });
    await this.assert({
      toHaveURL:`${BASE_URL}/articles/news`,
      alias: 'News Filtered Articles Page URL'
    });
  }
  async filterWithNewsAndInterviews(){
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectAndClick(this.filterOptionNews, 'News Option');
    await this.expectAndClick(this.filterOptionInterviews, 'Interviews Option');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.assert({
      locator: this.filterChipNews,
      state: 'visible',
      alias: 'News Filter Chip'
    });
    await this.assert({
      locator: this.filterChipInterviews,
      state: 'visible',
      alias: 'Interviews Filter Chip'
    });
    await this.assert({
      toHaveURL:`${BASE_URL}/articles/news,interview`,
      alias: 'News and Interviews Filtered Articles Page URL'
    });
  }
  async filterWithNewsInterviewsVfxMarketplaceSculpting(){
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.expectAndClick(this.filterOptionNews, 'News Option');
    await this.expectAndClick(this.filterOptionInterviews, 'Interviews Option');
    await this.expectAndClick(this.filterOptionVfx, 'VFX Option');
    await this.expectAndClick(this.filterOptionMarketplace, 'Marketplace Option');
    await this.expectAndClick(this.filterOptionSculpting, 'Sculpting Option');
    await this.expectAndClick(this.filterField, 'Filter Field');
    await this.assert({
      locator: [
        { element: this.filterChipNews, alias: 'News Filter Chip' },
        { element: this.filterChipInterviews, alias: 'Interviews Filter Chip' },
        { element: this.filterChipVfx, alias: 'VFX Filter Chip' },
        { element: this.filterChipMarketplace, alias: 'Marketplace Filter Chip' },
        { element: this.filterChipSculpting, alias: 'Sculpting Filter Chip' }
      ],
      state: 'visible'
    });
    await this.assert({
      toHaveURL:`${BASE_URL}/articles/news,interview,marketplace,vfx,Sculpting-Artists`,
      alias: 'News, Interviews, VFX, Marketplace and Sculpting Filtered Articles Page URL'
    });
  }
async popularTabCheckAllFitersEmptyResults() {
    await this.expectAndClick( this.popularBtn,'Popular Button');
    await this.checkAllFilterForEmptyResults();
  }
  async checkAllFilterForEmptyResults() {
    const filters = [
      { option: this.filterOptionNews, chip: this.filterChipNews, name: 'News' },
      { option: this.filterOptionInterviews, chip: this.filterChipInterviews, name: 'Interviews' },
      { option: this.filterOptionVfx, chip: this.filterChipVfx, name: 'VFX' },
      { option: this.filterOptionMarketplace, chip: this.filterChipMarketplace, name: 'Marketplace' },
      { option: this.filterOptionSculpting, chip: this.filterChipSculpting, name: 'Sculpting' },
      { option: this.filterOptionEnvironmentArt, chip: this.filterChipEnvironmentArt, name: 'Environment Art' },
      { option: this.filterOptionCharacterArt, chip: this.filterChipCharacterArt, name: 'Character Art' },
      { option: this.filterOptionRatings, chip: this.filterChipRatings, name: 'Ratings' },
      { option: this.filterOptionResearch, chip: this.filterChipResearch, name: 'Research' },
      { option: this.filterOptionProps, chip: this.filterChipProps, name: 'Props' },
      { option: this.filterOptionTech, chip: this.filterChipTech, name: 'Tech' },
      { option: this.filterOptionPromo, chip: this.filterChipPromo, name: 'Promo' },
    ];

    const filterNames = filters.map(f => f.name).join(', ');
    console.log(`🔍 Filters to be checked: ${filterNames}`);

    let foundEmptyResult = false;

    for (const { option, chip, name } of filters) {
      console.log(`\n🎯 Checking filter: ${name}`);

      await this.expectAndClick(this.filterField, 'Filter Field');
      await this.expectAndClick(option, `${name} Option`);
      await this.expectAndClick(this.filterField, 'Filter Field');

      await this.assert({
        locator: chip,
        state: 'visible',
        alias: `${name} Filter Chip`,
      });

      const isEmptyResult = await this.resetFiltersBtn.isVisible().catch(() => false);

      if (isEmptyResult) {
        foundEmptyResult = true;
        console.log(`✅✅✅ Empty result found for ${name} — showing empty state screen.`);
        await this.expectAndClick(this.resetFiltersBtn, 'Reset Filters Button');
      } else {
        await this.expectAndClick(chip, `${name} Filter Chip Removed`);
        console.log(`🟩 ${name} filter had results — chip removed successfully.`);
      }
    }
    if (!foundEmptyResult) {
      console.log(`⚠️  No empty results found — all filters returned content.`);
    }
  }

}
