import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Articles footer subscribe form', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_077:Articles Footer form email field validation @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.invalidSubscribe(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_078:Articles Footer form successful subscription @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.validSubscribe(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_079:Articles Footer form About & Contact us link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.aboutContactUsRedirection();
    })
  }  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_080:Articles Footer form Republishing policy link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.republishingPolicyRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_081:Articles Footer form Disclaimer link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.disclaimerRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_082:Articles Footer form Privacy Policy link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.privacyPolicyRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_083:Articles Footer form Terms of use link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await subscribeFormFooterPage.termsOfUseRedirection();
    })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_084:Articles Footer form Facebook redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.allArticlesPage);
            await subscribeFormFooterPage.facebookRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_085:Articles Footer form Twitter redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.allArticlesPage);
            await subscribeFormFooterPage.twitterRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_086:Articles Footer form YouTube redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.allArticlesPage);
            await subscribeFormFooterPage.youtubeRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_087:Articles Footer form Instagram redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.allArticlesPage);
            await subscribeFormFooterPage.instagramRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_088:Articles Footer form Podcasts Round Table redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.allArticlesPage);
            await subscribeFormFooterPage.podcastsRedirection();
        })
    }
});