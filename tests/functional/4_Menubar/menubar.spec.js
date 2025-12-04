import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';

test.describe('Menubar', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_038:Successful Navigation to all articles submenu @regression`, async ({ page, loginPage , menubarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToAllArticles(); 
    });
  }
  // Button has been removed from menubar

  // for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
  //   test(`${vp.name} TC_037:Successful redirection on research @regression`, async ({ page, loginPage, menubarPage  }) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit();
  //     await loginPage.acceptCookies();
  //     await menubarPage.navigateToResearchTalentsSubmenu();
  //   });
  // }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_031:Successful redirection on Talent Platform submenu @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToTalentPlatform();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_032:Successful redirection on Job board submenu @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToJobBoard();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_033:Successful redirection on Talent Platform submenu (with company login) @regression`, async ({ page, loginPage, menubarPage ,talentPage,useSession  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await useSession('company');
      await menubarPage.navigateToTalentPlatform();
      await talentPage.assertLoggedIn();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_036:Successful redirection on events @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToEvents();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_035:Successful redirection on workshops @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToWorkshops();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_028:Successful selected state on Company submenu @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToCompany();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_029:Successful selected state on Partners submenu @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToPartners();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_089:Successful Articles submenu News Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToNews();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_090:Successful Articles submenu Interviews Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToInterviews();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_091:Successful Articles submenu 80 Level Anivarsary Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToEightyLevelAnniversary();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_092:Successful Articles submenu Outsourcing cases Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToOutsourcingCases();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_093:Successful Articles submenu Marketplace Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToMarketplace();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_094:Successful Articles submenu Environment Art Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToEnvironmentArt();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_095:Successful Articles submenu Character Art Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToCharacterArt();
    });
  }
  //Button has been removed from menubar

  // for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
  //   test(`${vp.name} TC_096:Successful Articles submenu Research Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit();
  //     await menubarPage.navigateToResearchArticlesSubMenu();
  //   });
  // } 
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_097:Successful Articles submenu VFX Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToVFX();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_098:Successful Articles submenu Props Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToProps();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_099:Successful Articles submenu Animations Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToAnimation();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_100:Successful Articles submenu Gamedev Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToGamedev();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_101:Successful Articles submenu Materials Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToMaterials();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_102:Successful Articles submenu Tech Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToTech();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_103:Successful Articles submenu Ratings Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToRatings();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_104:Successful Articles submenu SPosored by unreal engine Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToSponsoredByUnrealEngine();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_105:Successful Articles submenu events Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToEventsArticlesSubMenu();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_106:Successful Articles submenu Digest Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToDigest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_107:Successful Articles submenu Feature Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToFeature();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_108:Successful Articles submenu Promo Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToPromo();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_109:Successful Articles submenu Scuplting Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToSculpting();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_110:Successful Articles submenu 80 level China Redirection @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await menubarPage.navigateToEightyLevelChina();
    });
  }
})

