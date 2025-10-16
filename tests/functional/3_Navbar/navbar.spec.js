import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';

test.describe('Navbar', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_011:Successful Advertise redirection`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.advertiseRedirection(); 
    });
  }
   for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_012:Successful Order research redirection`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.orderResearchRedirection(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name}  @regression TC_013:Successful Company Logo Redirection`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.companyLogoRedirection(); 
    });
  }
})

