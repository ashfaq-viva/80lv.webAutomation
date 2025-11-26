import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Login to 80LV', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_002:Successful login(Without session @regression)`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await loginPage.doLogin(config.credentials.talentEmail,config.credentials.talentPassword); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_003:Successful login with session (talent) @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession('talent');
      await loginPage.visit();
      await loginPage.assertLoggedIn(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_004:Successful login with session (company) @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession('company');
      await loginPage.visit();
      await loginPage.assertLoggedIn(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_005:Login with Facebook redirection link @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.loginWithFacebook(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_006:Login with Xsolla redirection link @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.loginWithXsolla(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_007:Login with Google redirection link @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.loginWithGoogle(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_008:Login with LinkdIn redirection link @regression`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.loginWithLinkdIn(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} @regression TC_009:Login with Twitter redirection link`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.loginWithTwitter(); 
    });
  }

})

