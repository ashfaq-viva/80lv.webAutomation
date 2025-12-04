import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Events Page', () => {
  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_111:Successful Big Image Banner visbility and redirection @regression`, async ({ page, loginPage , bigImageBannerPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await bigImageBannerPage.bannerVisibilityAndRedirectionWithoutMenuOpened('events/eventsBigImageBanner'); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_112:Successful redirection on all sponsored tag present @regression`, async ({ page, loginPage ,sponsoredTagPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage); 
      await sponsoredTagPage.clickAllSponsoredTagsAndAssertTabs(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_113:Check pagination of all events if present with oldest filter @regression`, async ({ page, loginPage ,menubarPage,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsTabDefaultFilterOldest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_114:Check pagination of online events if present with oldest filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsTabDefaultFilterOldest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_115:Check pagination of offline events if present with oldest filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsTabDefaultFilterOldest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_116:Check pagination of all events if present with newest filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsTabFilterNewest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_117:Check pagination of all events if present with A-Z filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.alleventsTabFilterAToZ();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_118:Check pagination of all events if present with Z-A filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.alleventsTabFilterZToA();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_119:Check pagination of online events if present with newest filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsTabFilterNewest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_120:Check pagination of online events if present with A-Z filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEvnentsTabFilterAToZ();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_121:Check pagination of online events if present with Z-A filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsTabFilterZToA();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_122:Check pagination of offline events if present with newest filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsTabFilterNewest();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_123:Check pagination of offline events if present with A-Z filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsTabFilterAToZ();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_124:Check pagination of offline events if present with Z-A filter @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsTabFilterZToA();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_125:Valid Search functionality in All events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.validSearchAllEvents(config.data.validEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_126:Valid Search functionality in Online events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.validSearchOnlineEvents(config.data.validEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_127:Valid Search functionality in Offline events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.validSearchAllEvents(config.data.validEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_128:Invalid Search functionality in All events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.invalidSearchAllEvents(config.data.invalidEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_129:Invalid Search functionality in Online events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.invalidSearchOnlineEvents(config.data.invalidEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_130:Invalid Search functionality in Offline events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.invalidSearchOfflineEvents(config.data.invalidEventSearch);
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_131:Check expantion and collapse of events card in all events tab @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsCardsExpandAndCollapse();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_132:Check expantion and collapse of events card of events in online events tab @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsCardsExpandAndCollapse();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_133:Check expantion and collapse of events card of events in offline events tab @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsCardsExpandAndCollapse();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_134:Successful redirection of all official website of event cards of all events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsCardsOffcialWebSiteRedirection('events/allEventsOfficialWebsiteredirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_135:Successful redirection of all official website of event cards of online events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsCardsoffcialWebSiteRedirection('events/onlineEventsOfficialWebsiteredirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_136:Successful redirection of all official website of event cards of offline events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsCardsoffcialWebSiteRedirection('events/offlineEventsOfficialWebsiteredirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_137:Successful redirection Google Calender of event cards of all events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsCardsGoogleCalenderRedirection();
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_138:Successful redirection Google Calender of event cards of online events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsCardsGoogleCalenderRedirection();
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_139:Successful redirection Google Calender of event cards of offline events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsCardsGoogleCalenderRedirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_140:Successful redirection ICalender of event cards of all events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.allEventsCardsICalenderRedirection('events/allEventsICalenderRedirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_141:Successful redirection ICalender of event cards of online events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.onlineEventsCardsICalenderRedirection('events/onlineEventsICalenderRedirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_142:Successful redirection ICalender of event cards of offline events @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.offlineEventsCardsICalenderRedirection('events/offlineEventsICalenderRedirection');
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_143:Successful redirection of Google button @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.googleButtonRedirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_144:Successful redirection of iCalender button @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.iCalenderButtonRedirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_145:Featured Events Pagination functionality @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.futureEventsPaginationFunctionalityIfPresent();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_146:Featured Events all events  redirections @regression`, async ({ page, loginPage ,eventsPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await eventsPage.futureEventsCardsWithPagination();
    });
  }
  // for (const vp of [Desktop]) {
  //   test(`${vp.name} TC_147:Footer Bottom promo banner visibility with redirection @regression`, async ({ page, loginPage , promoImageBannerPage}) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit(config.slug.eventsPage);
  //     await promoImageBannerPage.footerPromoImageBannerRedirection('events/footerPromoBanner'); 
  //   });
  // }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_148: Footer form email field validation @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.invalidSubscribe(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_149: Footer form successful subscription @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.validSubscribe(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_150: Footer form About & Contact us link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.aboutContactUsRedirection();
    })
  }  
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_151: Footer form Republishing policy link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.republishingPolicyRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_152: Footer form Disclaimer link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.disclaimerRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_153: Footer form Privacy Policy link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.privacyPolicyRedirection();
    })
    }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_154: Footer form Terms of use link @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.eventsPage);
      await subscribeFormFooterPage.termsOfUseRedirection();
    })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_155: Footer form Facebook redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.eventsPage);
            await subscribeFormFooterPage.facebookRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_156: Footer form Twitter redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.eventsPage);
            await subscribeFormFooterPage.twitterRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_157: Footer form YouTube redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.eventsPage);
            await subscribeFormFooterPage.youtubeRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_158: Footer form Instagram redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.eventsPage);
            await subscribeFormFooterPage.instagramRedirection();
        })
    }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {  
        test(`${vp.name} TC_159: Footer form Podcasts Round Table redirection @regression`, async ({ page, loginPage ,subscribeFormFooterPage }) => {
            await setViewport(page, vp.size);
            await loginPage.visit(config.slug.eventsPage);
            await subscribeFormFooterPage.podcastsRedirection();
        })
    }
})