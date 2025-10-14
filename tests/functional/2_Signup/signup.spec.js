import { test } from "../../../lib/BaseTest.js";
import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';

test.describe('Signup to 80LV', () => {
  //For this test you need have GMAIL_EMAIL & GMAIL_APP_PASSWORD in .env (instruction given in readme)
  for (const vp of [Desktop ,Laptop ,Tablet ,Mobile]) {
        test(`${vp.name}  @regression TC_010:Successful Sign up`, async ({  page, request,loginPage, signupPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit();
            await loginPage.acceptCookies();
            await signupPage.doSignup(request);
        });
    }
})