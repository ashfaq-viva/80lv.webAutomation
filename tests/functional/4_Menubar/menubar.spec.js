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
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_037:Successful redirection on research @regression`, async ({ page, loginPage, menubarPage  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await menubarPage.navigateToResearch();
    });
  }
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
    test(`${vp.name} TC_033:Successful redirection on Talent Platform submenu (with recruiter login) @regression`, async ({ page, loginPage, menubarPage ,talentPage,useSession  }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await useSession('recruiter');
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
})

