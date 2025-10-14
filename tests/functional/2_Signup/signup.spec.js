import { test } from "../../../lib/BaseTest.js";
import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';

test.describe('Signup to 80LV', () => {
  
  for (const vp of [Desktop ,Laptop ,Tablet ,Mobile]) {
        test(`${vp.name}  @regression TC_010:Successful Sign up`, async ({  page, request,loginPage, signupPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit();
            await loginPage.acceptCookies();
            await signupPage.doSignup(request);
        });
    }
})