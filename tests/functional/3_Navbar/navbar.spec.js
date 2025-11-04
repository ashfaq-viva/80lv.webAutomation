import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';

test.describe('Navbar', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_011:Successful Advertise redirection @regression`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.advertiseRedirection(); 
    });
  }
   for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_012:Successful Colored Header Button redirection @regression`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.headerButtonRedirection(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_013:Successful Company Logo Redirection @regression`, async ({ page, loginPage , navbarPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await navbarPage.companyLogoRedirection(); 
    });
  }
})

