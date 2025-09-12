import { setViewport, Laptop, Mobile } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';
import fs from "fs";

test.describe.serial('Login to 80LV', () => {
  
  for (const vp of [Laptop]) {
    test(`${vp.name}  @regression Successful login`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.acceptCookies();
      await loginPage.doLogin(config.credentials.talentEmail,config.credentials.talentPassword); 
    });
  }
    for (const vp of [Laptop]) {
    test(`${vp.name} @regression @talent Successful login with session`, async ({ page, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession('talent'); 
      await page.goto('/');
      await loginPage.assertLoggedIn(); 
    });
  }
})

