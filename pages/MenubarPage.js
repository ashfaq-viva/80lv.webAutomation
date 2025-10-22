import BasePage from './BasePage';
import  { BASE_URL } from '../playwright.config.js';

export class MenubarPage extends BasePage {
  constructor(page, context, loginpage) {
    super(page, context);
    this.loginpage = loginpage;
    this.articlesMenu = page.locator('div').filter({ hasText: /^Articles$/ }).getByRole('img');
    this.allArticlesSubMenu = page.getByText('All Articles');
    this.researchMenu = page.getByText('Research', { exact: true });
    this.talentsMenu = page.locator('div').filter({ hasText: /^Talents$/ }).getByRole('img');
    this.talentPlatformSubMenu = page.getByText('Talent Platform');
    this.jobBoardSubMenu = page.getByText('Job Board');
    this.eventsMenu = page.getByText('Events');
    this.workshopMenu = page.getByText('Workshops');
    this.aboutMenu = page.locator('div').filter({ hasText: /^About$/ }).getByRole('img');
    this.companySubMenu = page.getByText('Company', { exact: true });
    this.partnersSubMenu = page.getByText('Partners', { exact: true }).nth(0);
  }

  async navigateToAllArticles() {
    await this.expectAndClick({
        default: this.articlesMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
      },
      'Articles Menu Button');
      await this.expectAndClick({
        default: this.allArticlesSubMenu
      },
      'All Articles SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles`,
        alias: 'All Articles Page  Redirection'
      });
  }
  async navigateToResearch(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      await this.expectAndClick({
        default: this.researchMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.researchMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.researchMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.researchMenu],
      },
      'Research Menu Button'),
    ]);
    await newPage.waitForLoadState('load');
    await this.assert(
      {
        toHaveURL: `${BASE_URL}/research`,
        alias: 'Research Page  Redirection'
      },
      newPage 
    );
  }
  async navigateToTalentPlatform(){
    await this.expectAndClick({
        default: this.talentsMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
      },
      'Talents Menu Button');
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      await this.expectAndClick(this.talentPlatformSubMenu,'Talent Platform submenu'),
    ]);
    
    await newPage.waitForLoadState('load');
    await this.assert(
      {
        toHaveURL: `${BASE_URL}/talent`,
        alias: 'Talent Page  Redirection'
      },
      newPage 
    );
  }
  async navigateToJobBoard() {
    await this.expectAndClick({
        default: this.talentsMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.talentsMenu],
      },
      'Articles Menu Button');
      await this.expectAndClick(this.jobBoardSubMenu,'Job Board SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/jobs`,
        alias: 'Job board Page  Redirection'
      });
  }
  async navigateToEvents() {
    await this.expectAndClick({
        default: this.eventsMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.eventsMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.eventsMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.eventsMenu],
      },'Events Menu Button');
    await this.assert({
        toHaveURL: `${BASE_URL}/events`,
        alias: 'Events Page  Redirection'
    });
  }
  async navigateToWorkshops() {
    await this.expectAndClick({
        default: this.workshopMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.workshopMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.workshopMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.workshopMenu],
      },'Workshops Menu Button');
    await this.assert({
        toHaveURL: `${BASE_URL}/workshops`,
        alias: 'Workshops Page  Redirection'
    });
  }
  async navigateToCompany() {
    await this.expectAndClick({
        default: this.aboutMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
      },
      'About Menu Button');
      await this.expectAndClick(this.companySubMenu,'Company SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/contact-us#audience`,
        alias: 'Company Page  Redirection'
      });
  }
  async navigateToPartners() {
    await this.expectAndClick({
        default: this.aboutMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.aboutMenu],
      },
      'About Menu Button');
      await this.expectAndClick(this.partnersSubMenu,'Partners SubMenu Button','partnersApi:GET');
      await this.assert({
        toHaveURL: `${BASE_URL}/partners`,
        alias: 'Partners Page Redirection'
      });
  }
}

