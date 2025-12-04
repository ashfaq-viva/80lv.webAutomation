import BasePage from './BasePage';
import { getViewportNameFromPage } from '../utils/viewports.js';


export class BookmarkPage extends BasePage {
  constructor(page, context, loginPage) {
    super(page, context);
    this.loginPage = loginPage;
    this.addBookmarkTooltip = page.locator('div:has-text("Add bookmark")');
    this.removeBookmarkTooltip = page.locator('div:has-text("Remove bookmark")');
    this.bookamarked1stArticle = page.locator('article').first().locator('> div').first();
  }

  async assertBookmarkedItem(){
    await this.extractDetailsAndSaveAsJson(
              this.bookamarked1stArticle,
              'bookmarkPageCard',                   
              'card1',
              getViewportNameFromPage,                   
            );
      // Compare saved JSON with the expected JSON for the current viewport
  const viewportName = getViewportNameFromPage(this.page);
    await this.assertFromSavedJsonToJsonData(
  { 'bookmarkPageCard/card1': ['h2']},
  { [`allArticles/allArticleBookmarkedArticle/card1TC_054_${viewportName}`]: ['h1']}
);
  }
}
