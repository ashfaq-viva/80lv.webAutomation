import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('All Articles filters', () => {
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_055:Articles Filter Applied single filter @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.filterWithNews();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_056:Articles Filter Applied multiple filter @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.filterWithNewsAndInterviews();
    });
  }
  for (const vp of [Desktop,Laptop,Tablet,Mobile]) {
    test(`${vp.name} TC_058:Articles Filter Applied All Articles filter button @regression`, async ({ page, loginPage ,allArticlesPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit(config.slug.allArticlesPage);
      await allArticlesPage.filterAllArticleOption();
    });
  }
})

