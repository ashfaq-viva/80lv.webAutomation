import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Navbar Search', () => {

  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_014:Successful search modal seen`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.searchRedirection(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_015:Successful search results`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.validSearch(config.data.validSearch); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_016:Invaild Search results`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.invalidSearch(config.data.invalidSearch); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
        test(`${vp.name}  @regression TC_017:Successfully clearred searched value`, async ({ page, loginPage , navbarPage }) => {
        await setViewport(page, vp.size);
        await loginPage.visit();
        await loginPage.acceptCookies();
        await navbarPage.searchClear(config.data.validSearch); 
        });
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_018:Successful search modal close`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.searchModalClose(); 
    });
  }
})

