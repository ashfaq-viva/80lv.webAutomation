import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Articles', () => {
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_048:Successful popular button result @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.popularButtonResult(); 
    });
  }
    for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_049:Successful new button result @regression`, async ({ page, loginPage , allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.newButtonResult(); 
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_050:Articles New button result with five filters applied @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.fiveFiltersInNewTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_051:Articles Popular button result with five filters applied @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.fiveFiltersInPopularTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_052:Articles Popular button result with Empty result @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.popularTabCheckAllFitersEmptyResults();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_059:Articles Popular button result with Empty result @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.checkAllFilterForEmptyResults();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_053:Article add bookmark without login @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.bookmarkArticle(); 
      await loginPage.assertLoginModalVisibility();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
        test(`${vp.name} TC_054:Successful bookmark of article with login @regression`, async ({ page, loginPage , allArticlesPage,useSession ,navbarPage ,bookmarkPage}) => {
        await setViewport(page, vp.size);
        await useSession('company');
        await loginPage.visit(config.slug.allArticlesPage);
        await allArticlesPage.bookmarkArticleWithLogin(); 
        await navbarPage.navigateToBookmarkPage();
        await bookmarkPage.assertBookmarkedItem();
        });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_057:Article pagination with two filters popular tab and pagination check @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.twoFiltersInPopularTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_060:Successful Articles card redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.article1Redirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_062:Successful Pagination Left Arrow visibility and functionality Check @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.paginationLeftArrowCheck();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_063:Successful Pagination Right Arrow visibility and functionality Check @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.paginationRightArrowCheck();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_064:Article pagination with single filter popular tab and pagination check  @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.singleFilterInPopularTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_065:Article pagination without filter new button result @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.newTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_066:Article pagination without filter popular button result @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.popularTabPagination();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_068:Article newletter invalid email subscription Check @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.invalidSubscribeNewsletter();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_069:Article newletter valid Subscription @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.validSubscribeNewsletter();
    });
  }
  // for (const vp of [Desktop]) {
  //   test(`${vp.name} TC_070:Articles Job board jobs redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit(config.slug.allArticlesPage);
  //     await allArticlesPage.jobBoardJobsRedirection();
  //   });
  // }
  // for (const vp of [Desktop]) {
  //   test(`${vp.name} TC_071:Articles Job board all vacancies redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
  //     await setViewport(page, vp.size);
  //     await loginPage.visit(config.slug.allArticlesPage);
  //     await allArticlesPage.jobBoardAllVacanciesRedirection();
  //   });
  // }
  for (const vp of [Desktop]) {
    test(`${vp.name} TC_072:Articles partners slider widget functionality @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.sliderWidgetRightandLeft();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_073:Articles partners Image click redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.partnerLinksRedirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_074:Articles partners Explore buttons redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.partnersExploreButtonsRedirection();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_075:Articles partners Become a partner redirection @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.partnersBecomeAPartnerRedirection();
    });
  }
})

