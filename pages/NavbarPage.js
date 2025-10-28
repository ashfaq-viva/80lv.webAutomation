import BasePage from './BasePage';
import  { BASE_URL } from '../playwright.config.js';

export class NavbarPage extends BasePage {
  constructor(page, context, loginpage,bookamarkPage) {
    super(page, context);
    this.loginpage = loginpage;
    this.bookamarkPage = bookamarkPage;
    this.adevertiseBtn= page.getByText('Advertise');
    this.orderResearchBtn= page.getByRole('link', { name: 'Order Research' });
    this.companyLogo= page.getByRole('img', { name: 'logo80lv' });
    this.search= page.getByRole('button', { name: 'search' });
    this.searchResponsive= page.getByRole('img', { name: 'search' });
    this.closeIcon= page.getByRole('button', { name: 'Close' });
    this.searchCrossIcon= page.getByRole('button', { name: 'Clear search box' });
    this.searchTextBox= page.locator('#gsc-i-id2');
    this.noResultTxt= page.getByText('No Results');
    this.resultDiv1= page.locator('.gsc-expansionArea > div').first();
    this.navbarThreeDotMenuOld =  page.getByRole('button', { name: 'Menu' });
    this.profileIcon= page.getByRole('img', { name: 'profile_loggedin' });
    this.bookmarkOption= page.getByRole('link', { name: 'bookmark Bookmarks' });
  }

  async advertiseRedirection() {
    await this.expectAndClick({
        default: this.adevertiseBtn,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
      },
      'Advertise Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/contact-us#Promote`,
        alias: 'Advertise Redirect'
      });
  }
  async orderResearchRedirection() {
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.orderResearchBtn },
        'Advertise Button'
      ),
    ]);
    await newPage.waitForLoadState('load');
    await this.assert(
      {
        toHaveURL: 'https://80level.typeform.com/request-form?utm_source=website_80lv&utm_medium=top-button',
        alias: 'Order Research redirection'
      },
      newPage 
    );
  }
  async companyLogoRedirection() {
    await this.expectAndClick({
        default: this.companyLogo
      },
      'Company Logo');
      await this.assert({
        toHaveURL: `${BASE_URL}`,
        alias: 'Company Logo Redirection'
      });
  }
  async searchRedirection() {
    await this.expectAndClick({
        default: this.search,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
      },
      'Search');
      await this.assert({
        locator: this.closeIcon,
        state: 'visible',
        alias: 'Cross icon'
      });
  }
  async validSearch(searchKey) {
    await this.expectAndClick({
        default: this.search,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
      },
      'Search');
    await this.waitAndFill(null,searchKey,'Search Field'); 
    await this.page.keyboard.press('Enter');
    await this.assert({
        locator: this.resultDiv1,
        state: 'visible',
        alias: 'No result Text'
      });
  }
  async invalidSearch(searchKey) {
    await this.expectAndClick({
        default: this.search,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
      },
      'Search');
    await this.waitAndFill(null,searchKey,'Search Field'); 
    await this.page.keyboard.press('Enter');
    await this.assert({
        locator: this.noResultTxt,
        state: 'visible',
        alias: 'No result Text'
      });
  }
  async searchClear(searchKey) {
    await this.expectAndClick({
        default: this.search,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
      },
      'Search');
    await this.waitAndFill(null,searchKey,'Search Field'); 
    await this.page.keyboard.press('Enter');
    await this.expectAndClick({
        default: this.searchCrossIcon
      },
      'Search cleared');
  }
  async searchModalClose() {
    await this.expectAndClick({
        default: this.search,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.searchResponsive],
      },
      'Search');
      await this.expectAndClick({
        default: this.closeIcon
      },
      'Search');
      await this.assert({
        locator: {
          default: this.companyLogo
        },
        state: 'visible',
        alias: 'Company logo visible'
      });
  }
  async navigateToBookmarkPage(){
    await this.expectAndClick({
        default: this.profileIcon,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld],
      },
      'Profile Menu');
    await this.expectAndClick(this.bookmarkOption,'Bookmark Option');
    await this.assert({
        locator: this.bookamarkPage.bookmarkTxt,
        state: 'visible',
        alias: 'Bookmark Text'
    });
      await this.assert({
        toHaveURL: '/bookmarks',
        alias: 'Bookmark Page'
      });
  }  
}

