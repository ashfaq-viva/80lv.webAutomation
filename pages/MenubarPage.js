import BasePage from './BasePage';
import  { BASE_URL } from '../playwright.config.js';

export class MenubarPage extends BasePage {
  constructor(page, context, loginpage ,talentPage) {
    super(page, context);
    this.loginpage = loginpage;
    this.talentPage = talentPage;
    this.articlesMenu = page.locator('div').filter({ hasText: /^Articles$/ }).getByRole('img');
    this.allArticlesSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="All Articles"]');
    this.researchMenu = page.getByText('Research').first();
    this.talentsMenu = page.locator('div').filter({ hasText: /^Talents$/ }).getByRole('img');
    this.talentPlatformSubMenu = page.locator('//div[contains(., "Talents")]/following-sibling::div//div[normalize-space(text())="Talent Platform"]');
    this.jobBoardSubMenu = page.locator('//div[contains(., "Talents")]/following-sibling::div//div[normalize-space(text())="Job Board"]');
    this.eventsMenu = page.getByText('Events');
    this.workshopMenu = page.getByText('Workshops');
    this.aboutMenu = page.locator('div').filter({ hasText: /^About$/ }).getByRole('img');
    this.companySubMenu = page.locator('//div[contains(., "About")]/following-sibling::div//div[normalize-space(text())="Company"]');
    this.partnersSubMenu = page.locator('//div[contains(., "About")]/following-sibling::div//div[normalize-space(text())="Partners"]');
    this.newsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="News"]');
    this.interviewsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Interviews"]');
    this.eightyLevelAnnivarsarySubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="80 Level Anniversary"]');
    this.outsourcingCasesSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Outsourcing Cases"]');
    this.marketplaceSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Marketplace"]');
    this.environmentArtSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Environment Art"]');
    this.characterArtSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Character Art"]');
    this.researchSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Research"]');
    this.vfxSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="VFX"]');;
    this.propsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Props"]');;
    this.animationSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Animation"]');;
    this.gamedevSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Gamedev"]');
    this.materialsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Materials"]');;
    this.techSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Tech"]');
    this.ratingsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Ratings"]');
    this.sponsoredByUnrealEngineSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Sponsored by Unreal Engine"]');
    this.eventsSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Events"]');;
    this.digestSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Digest"]');;
    this.featureSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Feature"]');;
    this.promoSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Promo"]');;
    this.sculptingSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="Sculpting"]');;
    this.eightyLevelChinaSubMenu = page.locator('//div[contains(., "Articles")]/following-sibling::div//div[normalize-space(text())="80 Level China"]');
  }

  async navigateToArticlesMenu() {
    await this.expectAndClick({
        default: this.articlesMenu,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.articlesMenu],
      },
      'Articles Menu Button');
    }
  async navigateToAllArticles() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick({
        default: this.allArticlesSubMenu
      },
      'All Articles SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles`,
        alias: 'All Articles Page  Redirection'
      });
  }
  async navigateToNews() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.newsSubMenu,'All Articles News SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/news`,
        alias: 'News Page  Redirection'
      });
  }
  async navigateToInterviews() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.interviewsSubMenu,'Interviews SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/interview`,
        alias: 'Interviews Page  Redirection'
      });
  }
  async navigateToEightyLevelAnniversary() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.eightyLevelAnnivarsarySubMenu,'Eighty Level Anniversary SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/80-level-anniversary`,
        alias: 'Eighty Level Anniversary Page  Redirection'
      });
  }
  async navigateToOutsourcingCases() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.outsourcingCasesSubMenu,'Outsourcing Cases SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/outsourcing-solutions`,
        alias: 'Outsourcing Cases Page  Redirection'
      });
  }
  async navigateToMarketplace() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.marketplaceSubMenu,'Marketplace SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/marketplace`,
        alias: 'Marketplace Page  Redirection'
      });
  }
  async navigateToEnvironmentArt() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.environmentArtSubMenu,'Environment Art SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/environment-art`,
        alias: 'Environment Art Page  Redirection'
      });
  }
  async navigateToCharacterArt() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.characterArtSubMenu,'Character Art SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/character-art`,
        alias: 'Character Art Page  Redirection'
      });
  } 
  async navigateToResearchArticlesSubMenu() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.researchSubMenu,'Research Articles SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/research`,
        alias: 'Research Page  Redirection'
      });
  }
  async navigateToVFX() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.vfxSubMenu,'VFX SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/vfx`,
        alias: 'VFX Page  Redirection'
      });
  }
  async navigateToProps() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.propsSubMenu,'Props SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/props`,
        alias: 'Props Page  Redirection'
      });
  }
  async navigateToAnimation() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.animationSubMenu,'Animation SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/animation`,
        alias: 'Animation Page  Redirection'
      });
  }
  async navigateToGamedev() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.gamedevSubMenu,'GameDev SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/gamedev`,
        alias: 'GameDev Page  Redirection'
      });
  }
  async navigateToMaterials() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.materialsSubMenu,'Materials SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/materials`,
        alias: 'Materials Page  Redirection'
      });
  }
  async navigateToTech() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.techSubMenu,'Tech SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/tech`,
        alias: 'Tech Page  Redirection'
      });
  }
  async navigateToRatings() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.ratingsSubMenu,'Ratings SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/ratings`,
        alias: 'Ratings Page  Redirection'
      });
  }
  async navigateToSponsoredByUnrealEngine() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.sponsoredByUnrealEngineSubMenu,'Sponsored by Unreal Engine SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/sponsored-by-unreal-engine`,
        alias: 'Sponsored by Unreal Engine Page  Redirection'
      });
  }
  async navigateToEventsArticlesSubMenu() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.eventsSubMenu,'Events SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/events`,
        alias: 'Events Page  Redirection'
      });
  }
  async navigateToDigest() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.digestSubMenu,'Digest SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/digest`,
        alias: 'Digest Page  Redirection'
      });
  }
  async navigateToFeature() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.featureSubMenu,'Feature SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/feature`,
        alias: 'Feature Page  Redirection'
      });
  }
  async navigateToPromo() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.promoSubMenu,'Promo SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/promo`,
        alias: 'Promo Page  Redirection'
      });
  }
  async navigateToSculpting() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.sculptingSubMenu,'Sculpting SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/Sculpting-Artists`,
        alias: 'Sculpting Page  Redirection'
      });
  }
  async navigateToEightyLevelChina() {
    await this.navigateToArticlesMenu();
      await this.expectAndClick(this.eightyLevelChinaSubMenu,'Eighty Level China SubMenu Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/articles/80-level-china`,
        alias: 'Eighty Level China Page  Redirection'
      });
  }
  async navigateToResearchTalentsSubmenu(){
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
    await newPage.setViewportSize(this.page.viewportSize());
    await newPage.waitForLoadState('load');
    await this.assert(
      {
        toHaveURL: `${BASE_URL}/talent`,
        alias: 'Talent Page  Redirection'
      },
      newPage 
    );
    this.talentPage.initLocators(newPage);
  return this.talentPage;
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

