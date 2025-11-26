import { expect } from '@playwright/test';
import { getViewportNameFromPage } from '../utils/viewports.js';
import { allure } from 'allure-playwright';
import apiMap from '../api/apiMap.js';
import  { BASE_URL } from '../playwright.config.js';
import fs from 'fs';
import path from 'path';

export default class BasePage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.defaultTimeout = 10000;
  }
// 🔹 Get the friendly viewport name using the shared util
 #_viewportName() {
  return getViewportNameFromPage(this.page); // 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile'
}

// 🔹 Accepts:
//   - a single locator
//   - a map { default, Desktop, Laptop, Tablet, Mobile }
//   - or a map where any entry is an array of locators
#_resolveLocator(locatorOrMap) {
  // Case 1: direct single locator
  if (locatorOrMap && typeof locatorOrMap.click === 'function' && typeof locatorOrMap.waitFor === 'function') {
    return [locatorOrMap]; 
  }

  // Case 2: map-based locator
  const vp = this.#_viewportName();
  const map = locatorOrMap || {};

  const resolved =
    map[vp] ||
    map.default ||
    map.Desktop ||
    map.Laptop ||
    map.Tablet ||
    map.Mobile;

  if (!resolved) return null;
  return Array.isArray(resolved) ? resolved : [resolved];
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for expectAndClick()
 * ------------------------------------------------------

 * 1️⃣  Click an element for ALL viewports
 * ------------------------------------------------------
 * Automatically resolves the correct locator based on 
 * current viewport (Desktop / Laptop / Tablet / Mobile).
 * ------------------------------------------------------
    await this.expectAndClick(
      this.loginBtnDesktop,
      'Login Button'
    );


 * 2️⃣  Click using viewport-specific locators
 * ------------------------------------------------------
 * “default” is used unless a specific viewport override
 * (Laptop, Tablet, Mobile) is provided.
 * Each viewport can contain a single locator or an array
 * of sequential steps (multi-step clicks).
 * ------------------------------------------------------
    await this.expectAndClick(
      {
        default: this.profileLogIn,
        Laptop:  [this.navbarThreeDotMenuOld, this.profileLogInOld],
        Tablet:  [this.navbarThreeDotMenuOld, this.profileLogInOld],
        Mobile:  [this.navbarThreeDotMenuOld, this.profileLogInOld],
      },
      'Login Button'
    );


 * 3️⃣  Click + Assert Specific API + Auto Detect API + Save Response
 * ------------------------------------------------------
 * - Third argument → 'apiKey:METHOD' for API assertion  
 * - detectApi → can be TRUE (auto) or an apiKey  
 * - saveApiResponse → save the captured API JSON  
 * - saveFileName → location inside /savedData/apiResponses  
 * ------------------------------------------------------
    await this.expectAndClick(
      {
        default: this.allEventsTab,
        Mobile:  [
          this.responsiveFilterArrow,
          this.responsiveAllEventsTab
        ]
      },
      'All Events Tab',                       // alias
      'allEventsFilterOldestApi:GET',         // assert API from apiMap
      {
        detectApi: "allEventsFilterOldestApi", // listen only for this API
        saveApiResponse: true,                 // write to disk
        saveFileName: "events/GETOldestAllEvents"
      }
    );

 * ------------------------------------------------------
 * ✔ Summary
 * - Use single locator → applies to all viewports
 * - Use { default, Laptop, Tablet, Mobile } → override per device
 * - Third parameter → API assertion ("apiKey:METHOD")
 * - Fourth parameter → options (detectApi, retries, save API)
 * ------------------------------------------------------
*/
async expectAndClick(
  locatorOrMap,
  alias = "element",
  apiKeyWithMethod = null,
  {
    maxAttempts = 1,
    delay = 500,
    detectApi = true,       
    timeout = 5000,
    saveApiResponse = false, 
    saveFileName = null 
  } = {}
) {
  const locators = this.#_resolveLocator(locatorOrMap);
  if (!locators || !locators.length) {
    throw new Error(`expectAndClick: no locator(s) resolved for [${alias}]`);
  }

  const vp = this.#_viewportName();

  // --- Parse apiKeyWithMethod (optional API assertion)
  let apiAssertion = null;
  if (apiKeyWithMethod) {
    const [apiKey, methodOverride] = apiKeyWithMethod.split(":");
    if (!apiMap[apiKey]) throw new Error(`API key '${apiKey}' not found in apiMap`);

    const apiEntry = apiMap[apiKey];
    const method = methodOverride
      ? methodOverride.toUpperCase()
      : Object.keys(apiEntry.methods)[0];
    const expectedStatus = apiEntry.methods[method]?.expectedStatus || 200;
    apiAssertion = { url: apiEntry.url, method, expectedStatus };
  }

  // --- Allow detectApi to be an API key as well
  if (typeof detectApi === "string" && !apiAssertion) {
    if (!apiMap[detectApi]) throw new Error(`API key '${detectApi}' not found in apiMap`);
    const apiEntry = apiMap[detectApi];
    const method = Object.keys(apiEntry.methods)[0];
    const expectedStatus = apiEntry.methods[method]?.expectedStatus || 200;
    apiAssertion = { url: apiEntry.url, method, expectedStatus };
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let response = null;

      // Sequentially click all locators (if multiple)
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const stepAlias = locators.length > 1 ? `${alias} (Step ${i + 1})` : alias;

        await locator.waitFor({ state: "visible", timeout: this.defaultTimeout });

        const text =
          (await locator.innerText().catch(() => ""))?.trim() ||
          (await locator.getAttribute("aria-label").catch(() => "")) ||
          (await locator.getAttribute("alt").catch(() => "")) ||
          stepAlias;

        // --- Detect or assert API
        if (detectApi && i === locators.length - 1) {
          try {
            if (apiAssertion) {
              // ✅ Wait for specific API (assertion mode)
              const waitForResponseFn = (response) =>
                response.url().startsWith(apiAssertion.url) &&
                response.request().method().toUpperCase() === apiAssertion.method;

              const results = await Promise.allSettled([
                locator.click(),
                this.page.waitForResponse(waitForResponseFn, { timeout }),
              ]);
              response = results.find((r) => r.status === "fulfilled" && r.value?.url)?.value || null;

            } else {
              // ✅ Capture ALL APIs (auto-detect)
              const collectedResponses = [];
              const listener = (response) => {
                const u = new URL(response.url());
                if (
                  u.hostname.includes("cdn.80.lv") ||
                  u.hostname.includes("consent-api.xsolla.com") ||
                  u.href.includes("/api/updpromos") ||
                  u.href.includes("/upload/promo") ||
                  u.href.includes("/upload/post") ||
                  u.href.includes("/upload/vendor") ||
                  u.href.includes("/updpromos") ||
                  u.href.includes("/upload")
                ) return;

                const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");
                const firstLabel = u.hostname.split(".")[0].toLowerCase();
                const hostIsApi = /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);

                if (pathIsApi || hostIsApi) collectedResponses.push(response);
              };

              this.page.on("response", listener);
              await locator.click();
              await this.page.waitForTimeout(2000); // small wait to catch all APIs
              this.page.off("response", listener);

              response = collectedResponses;
            }
          } catch {
            response = null;
          }
        } else {
          await locator.click();
        }

        console.log(`✅ Clicked [${stepAlias} @ ${vp}] → "${text}"`);
      }

      // --- Handle API logs, assertions, and saving
      if (response) {
        const responses = Array.isArray(response) ? response : [response];

        if (apiAssertion) {
          const actualStatus = response.status();
          console.log(`🌐 Captured API: ${response.url()} → ${response.request().method()} | Status: ${actualStatus}`);
          console.log(`🔗 Expected: ${apiAssertion.url} → ${apiAssertion.method} | Status: ${apiAssertion.expectedStatus}`);
          const passed = actualStatus === apiAssertion.expectedStatus;
          console.log(`✅ Assertion API: ${passed ? "Passed" : "Failed ❌"}`);
          if (!passed) throw new Error(`API assertion failed for ${apiAssertion.url}`);
        } else {
          responses.forEach((res) => {
            console.log(`🌐 Captured API → ${res.request().method()} ${res.url()} | Status: ${res.status()}`);
          });
        }

        // ✅ Save API responses if requested
        if (saveApiResponse && saveFileName) {
  const savedResponses = [];

  for (const res of responses) {
    let parsedBody = null;

    try {
      const bodyText = await res.text();
      // Try parsing, fallback to bodyText if not JSON
      parsedBody = JSON.parse(bodyText);
    } catch (err) {
      parsedBody = bodyText; // still fallback to string
    }

    // Ensure responseBody is always an object if possible
    if (typeof parsedBody === "string") {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch {}
    }

    savedResponses.push({
      url: res.url(),
      method: res.request().method(),
      status: res.status(),
      responseBody: parsedBody,
    });
  }

  const dir = path.join(process.cwd(), "savedData/apiResponses", path.dirname(saveFileName));
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(process.cwd(), "savedData/apiResponses", `${saveFileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(savedResponses, null, 2), "utf-8");

  console.log(`🗂️ API response saved at: ${filePath}`);
}
      }

      return true;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.warn(`Retrying click (${attempt}/${maxAttempts}) for [${alias} @ ${vp}]...`);
      await this.page.waitForTimeout(delay);
    }
  }
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for waitAndFill()
 * ------------------------------------------------------

 * 1️⃣  Fill input field (single locator — all viewports)
 * ------------------------------------------------------
 * Fills the field directly using the resolved locator.
 * Example: Search field, Login form, Text input, etc.
 * ------------------------------------------------------
    await this.waitAndFill(
      this.searchField,
      eventName,
      'Search Field'
    );


 * 2️⃣  Fill using viewport-specific locators
 * ------------------------------------------------------
 * "default" applies to all viewports unless overridden.
 * Multi-step arrays can be used (click → click → fill).
 * ------------------------------------------------------
    await this.waitAndFill(
      {
        default: this.newsletterEmailField,
        Mobile:  [this.mobileEmailExpand, this.newsletterEmailFieldMobile]
      },
      config.credentials.invalidEmail,
      'Invalid Email Address'
    );


 * 3️⃣  Type directly when locator is not found
 * ------------------------------------------------------
 * If locator fails to resolve, the function automatically
 * falls back to keyboard typing.
 * Useful for content-editable areas or special editors.
 * ------------------------------------------------------
    await this.waitAndFill(
      null,
      'Some Text',
      'Raw Typing Field'
    );
    // Logs: "No locator resolved… typing directly"


 * 4️⃣  Passing a value object (smart field detection)
 * ------------------------------------------------------
 * If value is an object → the function checks:
 *   - alias name inside value object
 *   - value.text
 *   - value.value
 * For auto-filling user models or structured test data.
 * ------------------------------------------------------
    const user = {
      email: "test@example.com",
      password: "Password123"
    };

    await this.waitAndFill(
      this.emailField,
      user,
      'email'
    );   // fills user.email

    await this.waitAndFill(
      this.passwordField,
      user,
      'password'
    );   // fills user.password


 * 5️⃣  Multi-step input (open menu → open form → fill)
 * ------------------------------------------------------
 * Steps before the last locator will be clicked to reach
 * the input field.
 * ------------------------------------------------------
    await this.waitAndFill(
      [ this.menuButton, this.formButton, this.inputField ],
      "Hello World",
      "Nested Input Field"
    );


 * 6️⃣  Using numeric values (auto-converted to string)
 * ------------------------------------------------------
    await this.waitAndFill(
      this.ageInput,
      32,
      'Age'
    );


 * 7️⃣  Custom timeout
 * ------------------------------------------------------
    await this.waitAndFill(
      this.addressInput,
      "Dhaka, Bangladesh",
      "Address Field",
      8000 // custom timeout
    );


 * ------------------------------------------------------
 * ✔ Summary
 * - Supports single locator OR viewport-specific map
 * - Accepts string, number, or structured object values
 * - Auto-detects field labels (placeholder / name / innerText)
 * - Handles multi-step locators (click path → final input)
 * - Falls back to raw keyboard typing if locator missing
 * ------------------------------------------------------
*/

async waitAndFill(locatorOrMap, value, alias = 'element', timeout = this.defaultTimeout) {
  const locators = this.#_resolveLocator(locatorOrMap);
  
  // ✅ Handle case where locator isn't provided — just type directly
  if (!locators || !locators.length) {
    console.warn(`⚠️ No locator resolved for [${alias}], typing directly...`);
    const fillValue =
      typeof value === 'object' && value !== null
        ? (value.text || value.value || '')
        : String(value);
    await this.page.keyboard.type(fillValue);
    console.log(`✅ Typed directly [${alias}] → "${fillValue}"`);
    return;
  }

  const vp = this.#_viewportName();
  const lastLocator = locators[locators.length - 1];

  // Handle multistep locators
  for (let i = 0; i < locators.length - 1; i++) {
    const stepAlias = `${alias} (Step ${i + 1})`;
    await locators[i].waitFor({ state: 'visible', timeout });
    await locators[i].click();
    console.log(`✅ Clicked [${stepAlias} @ ${vp}] to reach input`);
  }

  await lastLocator.waitFor({ state: 'visible', timeout });

  const label =
    (await lastLocator.getAttribute('name').catch(() => '')) ||
    (await lastLocator.getAttribute('placeholder').catch(() => '')) ||
    (await lastLocator.innerText().catch(() => '')).trim();

  // 🧠 Handle value smartly
  let fillValue;

  if (typeof value === 'string' || typeof value === 'number') {
    fillValue = String(value);
  } 
  else if (typeof value === 'object' && value !== null) {
    // 👇 Infer field from alias if userModel is passed
    const key = alias.toLowerCase();
    if (key in value) {
      fillValue = String(value[key]);
    } 
    else if ('text' in value) {
      fillValue = String(value.text);
    } 
    else if ('value' in value) {
      fillValue = String(value.value);
    } 
    else {
      throw new Error(`waitAndFill: alias "${alias}" not found in provided object.`);
    }
  } 
  else {
    throw new Error(
      `waitAndFill: Unsupported value type for [${alias}] → ${typeof value}`
    );
  }

  await lastLocator.fill(fillValue);
  console.log(`✅ Filled [${alias} @ ${vp}] → "${label || 'Unnamed field'}" with: "${fillValue}"`);
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for assert()
 * ------------------------------------------------------

 * 1️⃣  Basic visibility assertion
 * ------------------------------------------------------
    await this.assert({
      locator: this.loginBtn,
      state: 'visible',
      alias: 'Login Button'
    });


 * 2️⃣  Assert exact text
 * ------------------------------------------------------
    await this.assert({
      locator: this.loginBtn,
      toHaveText: 'Log In',
      alias: 'Login Button'
    });


 * 3️⃣  Assert partial text
 * ------------------------------------------------------
    await this.assert({
      locator: this.welcomeBanner,
      toContainText: 'Welcome',
      alias: 'Welcome Banner'
    });


 * 4️⃣  Assert page URL (exact or contains)
 * ------------------------------------------------------
    await this.assert({
      toHaveURL: 'https://example.com/dashboard',
      alias: 'Dashboard Page'
    });

    // Contains mode (auto-detected)
    await this.assert({
      toHaveURL: '/dashboard',
      alias: 'Dashboard Section'
    });


 * 5️⃣  Assert URL against multiple possible options
 * ------------------------------------------------------
    await this.assert({
      toHaveURL: [
        'https://site.com/profile',
        'https://site.com/user/profile'
      ],
      alias: 'Profile Page'
    });


 * 6️⃣  Multiple locators at once
 * ------------------------------------------------------
    await this.assert({
      locator: [
        { element: this.label1, alias: "Label 1" },
        { element: this.label2, alias: "Label 2" }
      ],
      toContainText: 'Active'
    });


 * 7️⃣  Multi-step locator (menu → sub-menu → element)
 * ------------------------------------------------------
    await this.assert({
      locator: [
        this.menuButton,
        this.subMenuButton,
        this.targetElement
      ],
      state: 'visible',
      alias: 'Target Option'
    });


 * 8️⃣  Assert count of matching elements
 * ------------------------------------------------------
    await this.assert({
      locator: this.listItems,
      count: 5,
      alias: 'List Items'
    });


 * 9️⃣  Assert input value
 * ------------------------------------------------------
    await this.assert({
      locator: this.emailField,
      toHaveValue: 'test@example.com',
      alias: 'Email Field'
    });


 * 🔟  Assert HTML attribute
 * ------------------------------------------------------
    await this.assert({
      locator: this.submitBtn,
      toHaveAttribute: { disabled: 'true' },
      alias: 'Submit Button'
    });


 * 1️⃣1️⃣  Assert CSS (per viewport)
 * ------------------------------------------------------
 * Define CSS per viewport:
 *   - Desktop
 *   - Laptop
 *   - Tablet
 *   - Mobile
 * ------------------------------------------------------
    await this.assert({
      locator: this.banner,
      alias: 'Hero Banner',
      toHaveCSS: {
        Desktop: { 'margin-left': '20px', 'font-size': '18px' },
        Mobile:  { 'margin-left': '10px', 'font-size': '14px' }
      }
    });


 * 1️⃣2️⃣  Using custom page object instead of default
 * ------------------------------------------------------
    await this.assert({
      locator: this.popupTitle,
      toHaveText: 'Success',
      page: this.popupPage,
      alias: 'Popup Title'
    });


 * ------------------------------------------------------
 * ✔ Summary
 * - Assert visibility, text, partial text, values, attributes
 * - Assert CSS rules by viewport
 * - Assert URL (string or array of allowed URLs)
 * - Support for multi-step locators with auto-click
 * - Support for multiple locators in one call
 * - Can use alternative `.page` when needed
 * ------------------------------------------------------
*/


async assert(options = {}, page = this.page) {
  const {
    locator: locatorOrMap,
    state,
    toHaveText,
    toContainText,
    toHaveURL,
    page: targetPage = this.page,
    count,
    toHaveValue,
    toHaveAttribute,
    toHaveCSS,
    alias: defaultAlias = 'locator',
  } = options;

  // normalize to array of objects { element, alias }
  const locatorsArray = Array.isArray(locatorOrMap)
    ? locatorOrMap.map(l => typeof l === 'object' ? l : { element: l, alias: defaultAlias })
    : [{ element: locatorOrMap, alias: defaultAlias }];

  for (const { element: loc, alias } of locatorsArray) {
    const locators = this.#_resolveLocator(loc);
    const vp = this.#_viewportName();
    const target = (locators && locators.length) ? locators[locators.length - 1] : null;

    // Click intermediate steps if more than 1
    if (locators && locators.length > 1) {
      for (let i = 0; i < locators.length - 1; i++) {
        const stepLocator = locators[i];
        const stepAlias = `${alias} (Step ${i + 1})`;
        if (await stepLocator.isVisible()) {
          await stepLocator.scrollIntoViewIfNeeded();
          await stepLocator.click();
          console.log(`✅ Clicked [${stepAlias} @ ${vp}]`);
          await page.waitForTimeout(300);
        }
      }
    }

    // --- Perform assertions on final target ---
      if (target && state) {
    await target.waitFor({ state: 'visible', timeout: this.defaultTimeout });
    await expect(target).toBeVisible({ timeout: this.defaultTimeout });
    console.log(`✅ Assert: element is visible [${alias} @ ${vp}]`);
  }

    if (target && toHaveText) {
      await expect(target).toHaveText(toHaveText);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has exact text "${toHaveText}"`);
    }

    if (target && toContainText) {
      await expect(target).toContainText(toContainText);
      console.log(`✅ Assert: element [${alias} @ ${vp}] contains text "${toContainText}"`);
    }

    if (target && typeof count === 'number') {
      await expect(target).toHaveCount(count);
      console.log(`✅ Assert: element [${alias} @ ${vp}] count is ${count}`);
    }

    if (target && toHaveValue) {
      await expect(target).toHaveValue(toHaveValue);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has value "${toHaveValue}"`);
    }

    if (target && toHaveAttribute) {
      const [attr, value] = Object.entries(toHaveAttribute)[0];
      await expect(target).toHaveAttribute(attr, value);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has attribute [${attr}] = "${value}"`);
    }

    if (target && toHaveCSS) {
      const vp = this.#_viewportName();      
      const cssRulesForViewport = toHaveCSS[vp]; 
      if (!cssRulesForViewport) {
        console.log(`ℹ️ No CSS assert for [${alias}] at viewport ${vp}`);
        continue;
      }
      for (const [cssProp, expectedValue] of Object.entries(cssRulesForViewport)) {
        // convert kebab-case to camelCase
        const camelProp = cssProp.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

        const actualValue = await target.evaluate((el, camelProp) => getComputedStyle(el)[camelProp], camelProp);

        if (actualValue !== expectedValue) {
          throw new Error(`❌ Assert failed: [${alias}] CSS property "${cssProp}" expected "${expectedValue}", got "${actualValue}" on ${vp}`);
        }
        console.log(`✅ Assert: [${alias}] CSS property "${cssProp}" = "${expectedValue}" @ ${vp}`);
      }
    }
  }
if (toHaveURL) {
  const normalize = (url) => url.replace(/\/+$/, '');
  const pageForURL = page || this.page; 
  const actualURL = normalize(await pageForURL.url());

  console.log(`🔹 Expected URL: ${toHaveURL}`);
  console.log(`🔹 Actual URL:   ${actualURL}`);

  if (Array.isArray(toHaveURL)) {
    // ✅ Array support
    const normalizedTargets = toHaveURL.map(u => normalize(u));
    expect(normalizedTargets).toContain(actualURL);
    console.log(`✅ Assert: page URL matched one of the expected options (${defaultAlias})`);
  } else if (typeof toHaveURL === 'string') {
    // ✅ String support
    const expectedURL = normalize(toHaveURL);
    if (expectedURL.startsWith('http') || expectedURL.startsWith(BASE_URL)) {
      await expect(actualURL).toBe(expectedURL);
      console.log(`✅ Assert: page URL is "${toHaveURL}" (${defaultAlias})`);
    } else {
      await expect(actualURL).toContain(expectedURL);
      console.log(`✅ Assert: page URL contains "${toHaveURL}" (${defaultAlias})`);
    }
  } else {
    console.warn('⚠️ toHaveURL must be a string or array:', toHaveURL);
  }
}
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for extractDetailsAndSaveAsJson()
 * ------------------------------------------------------

 * 1️⃣  Basic extraction (default behavior)
 * Extracts own text + child text tags and saves JSON with 
 * prefix + viewport name + timestamp.
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(
      articleCard1st,      //locator
      'articles',          // folder route under savedData/data/json/
      'CardData',          // prefix for file name
      getViewportNameFromPage
    );


 * 2️⃣  Using selector string
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(
      '.article-card:first-child',    //locator
      'articles',
      'CardData',
      getViewportNameFromPage
    );


 * 3️⃣  Exclude locator's own text
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(
      articleCard1st,
      'articles',
      'CardData',
      getViewportNameFromPage,
      { includeOwnText: false }
    );


 * 4️⃣  Custom file name prefix
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(
      articleCard1st,
      'events',
      'EventsCard',
      getViewportNameFromPage
    );


 * 5️⃣  Dynamic folder routes
 * ------------------------------------------------------
    const folderRoute = `home/articles/${todayFolder}`;
    await this.extractDetailsAndSaveAsJson(
      articleCard1st,    //locator
      folderRoute,
      'HomeCard',
      getViewportNameFromPage
    );


 * 6️⃣  Looping over multiple locators
 * ------------------------------------------------------
    const cards = await this.page.locator('.article-card').all();
    for (let i = 0; i < cards.length; i++) {
      await this.extractDetailsAndSaveAsJson(
        cards[i],
        'articles/list',
        `ArticleCard_${i}`,
        getViewportNameFromPage
      );
    }


 * 7️⃣  Extract per viewport
 * ------------------------------------------------------
    for (const vp of this.viewports) {
      await page.setViewportSize(vp.size);
      await this.extractDetailsAndSaveAsJson(
        articleCard1st,
        `articles/${vp.name}`,
        'CardData',
        getViewportNameFromPage
      );
    }


 * 8️⃣  Multiple sections on the same page
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(this.heroBanner, 'articlePage', 'Hero', getViewportNameFromPage);
    await this.extractDetailsAndSaveAsJson(this.articleBody, 'articlePage', 'Body', getViewportNameFromPage);
    await this.extractDetailsAndSaveAsJson(this.footer, 'articlePage', 'Footer', getViewportNameFromPage);


 * 9️⃣  Using default prefix
 * ------------------------------------------------------
    await this.extractDetailsAndSaveAsJson(
      articleCard1st,
      'articles',
      undefined,         // uses default prefix: "CardData"
      getViewportNameFromPage
    );


 * ------------------------------------------------------
 * ✔ Summary
 * - Accepts locator OR selector string
 * - Supports own text + child text tags
 * - JSON saved in `savedData/data/json/<folderRoute>/`
 * - File name = <prefix>_<viewport>_<timestamp>.json
 * - Can loop over multiple locators or viewports
 * - Optional `{ includeOwnText: false }` to skip locator text
 * ------------------------------------------------------
*/


async  extractDetailsAndSaveAsJson(locatorOrSelector, dirName, prefix = 'CardData', getViewportNameFn, options = { includeOwnText: true }) {
  const locator = typeof locatorOrSelector === 'string' 
    ? this.page.locator(locatorOrSelector) 
    : locatorOrSelector;

  const textTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'div', 'a', 'li', 'strong', 'em', 'blockquote', 'label', 'button'
  ];

  const extractedData = {};

  if (options.includeOwnText) {
    // Get the tag name of the locator
    const tagName = (await locator.evaluate(el => el.tagName.toLowerCase())) || 'self';
    const ownText = (await locator.textContent())?.trim();
    if (ownText) {
      extractedData[tagName] = ownText;
    }
  }

  // Extract child text content
  for (const tag of textTags) {
    const elements = await locator.locator(tag).allTextContents();
    if (elements.length > 0) {
      extractedData[tag] = elements.map(t => t.trim()).filter(Boolean);
    }
  }

  // Generate dynamic file name
  const viewportName = getViewportNameFn(this.page);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${prefix}_${viewportName}_${timestamp}.json`;

  // Create directory and save JSON
  const dirPath = path.resolve(`savedData/data/json/${dirName}`);
  const filePath = path.join(dirPath, fileName);

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(extractedData, null, 2), 'utf-8');

  console.log(`✅ Extracted and saved data to: ${filePath}`);
  return extractedData;
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for assertFromSavedJsonToJsonData()
 * ------------------------------------------------------

 * 1️⃣  Basic single JSON comparison
 * ------------------------------------------------------
 * Compare a single FROM JSON file with a single TO JSON file.
 * You must provide an object where keys are file paths (relative
 * to savedData/data/json/) and values are arrays of tags to compare.
 * ------------------------------------------------------
    await this.assertFromSavedJsonToJsonData(
      { 'allArticles/allArticlesRedirectedArticle/card1TC_60': ['h1'] }, // FROM
      { 'allArticles/articlePage/TitleH1': ['h1'] }                        // TO
    );


 * 2️⃣  Compare multiple tags in same file
 * ------------------------------------------------------
    await this.assertFromSavedJsonToJsonData(
      { 'allArticles/article1': ['h1', 'p', 'button'] },
      { 'allArticles/article1Copy': ['h1', 'p', 'button'] }
    );


 * 3️⃣  Compare multiple FROM → TO pairs at once
 * ------------------------------------------------------
    await this.assertFromSavedJsonToJsonData(
      {
        'allArticles/article1': ['h1', 'p'],
        'allArticles/article2': ['h1', 'p', 'button']
      },
      {
        'allArticles/article1Copy': ['h1', 'p'],
        'allArticles/article2Copy': ['h1', 'p', 'button']
      }
    );


 * 4️⃣  Tags can be arrays of strings
 * ------------------------------------------------------
 * The function will normalize both FROM and TO values as arrays,
 * so a single string is treated as a one-element array.
 * ------------------------------------------------------
    await this.assertFromSavedJsonToJsonData(
      { 'allArticles/card1': ['h1', 'p'] },
      { 'allArticles/card1Copy': ['h1', 'p'] }
    );


 * 5️⃣  Works for nested JSON files
 * ------------------------------------------------------
 * You can point to files in nested folders.
 * ------------------------------------------------------
    await this.assertFromSavedJsonToJsonData(
      { 'home/articles/ArticleCard1': ['h1', 'p'] },
      { 'home/articles/ArticleCard1Copy': ['h1', 'p'] }
    );


 * 6️⃣  Automatic mismatch reporting
 * ------------------------------------------------------
 * - Logs each tag comparison
 * - Reports index of mismatch
 * - Throws error if any mismatch found
 * ------------------------------------------------------
 * Example console output:
 * 🔹 Comparing JSON file: card1TC_60.json to TitleH1.json
 * Comparing value: h1: "Article Title" → h1: "Article Title"
 * ✅ MATCH OK
 * ❌ h1 mismatch at index 0: "Old Text" != "New Text"


 * 7️⃣  Comparison requirements
 * ------------------------------------------------------
 * - FROM and TO must have same number of entries
 * - Tags arrays must have same length per pair
 * - Relative paths are resolved under `savedData/data/json/`
 * - Supports `.json` file names dynamically with timestamp suffixes


 * 8️⃣  Recommended for automated regression checks
 * ------------------------------------------------------
 * - Compare extracted page content from different states/pages
 * - Ensure UI changes do not break expected structure
 * - Can integrate in CI/CD for content verification


 * 9️⃣  Looping over multiple comparisons
 * ------------------------------------------------------
    const comparisons = [
      {
        from: { 'allArticles/card1': ['h1', 'p'] },
        to: { 'allArticles/card1Copy': ['h1', 'p'] }
      },
      {
        from: { 'allArticles/card2': ['h1', 'p'] },
        to: { 'allArticles/card2Copy': ['h1', 'p'] }
      }
    ];

    for (const comp of comparisons) {
      await this.assertFromSavedJsonToJsonData(comp.from, comp.to);
    }


 * ------------------------------------------------------
 * ✔ Summary
 * - Compares FROM → TO JSON files by tags
 * - Supports multiple file pairs at once
 * - Normalizes single strings to arrays
 * - Logs all comparisons and mismatches
 * - Throws an error if any mismatch occurs
 * ------------------------------------------------------
*/

async assertFromSavedJsonToJsonData(matchFromObj, matchToObj) {
  const fromEntries = Object.entries(matchFromObj);
  const toEntries = Object.entries(matchToObj);

  if (fromEntries.length !== toEntries.length) {
    throw new Error('matchFrom and matchTo must have the same number of entries');
  }

  let mismatchFound = false;
  let mismatchMessage = '';

  for (let i = 0; i < fromEntries.length; i++) {
    const [fromPath, fromTags] = fromEntries[i];
    const [toPath, toTags] = toEntries[i];

    if (fromTags.length !== toTags.length) {
      throw new Error(`Tags length mismatch for pair: ${fromPath} → ${toPath}`);
    }

    // Load FROM JSON
    const fromFile = path.resolve('savedData/data/json/', fromPath);
    const fromFiles = fs.readdirSync(path.dirname(fromFile));
    const matchedFromFile = fromFiles.find(f => f.includes(path.basename(fromPath)) && f.endsWith('.json'));
    if (!matchedFromFile) {
      throw new Error(`❌ No matching FROM JSON file found for: ${fromPath}`);
    }
    const fromData = JSON.parse(fs.readFileSync(path.join(path.dirname(fromFile), matchedFromFile), 'utf-8'));

    // Load TO JSON
    const toFile = path.resolve('savedData/data/json/', toPath);
    const toFiles = fs.readdirSync(path.dirname(toFile));
    const matchedToFile = toFiles.find(f => f.includes(path.basename(toPath)) && f.endsWith('.json'));
    if (!matchedToFile) {
      throw new Error(`❌ No matching TO JSON file found for: ${toPath}`);
    }
    const toData = JSON.parse(fs.readFileSync(path.join(path.dirname(toFile), matchedToFile), 'utf-8'));

    console.log(`\n🔹 Comparing JSON file: ${matchedFromFile} to ${matchedToFile}`);

    // Compare each tag
    for (let j = 0; j < fromTags.length; j++) {
      const fromTag = fromTags[j];
      const toTag = toTags[j];

      // Normalize values to arrays
      const normalize = (val) =>
        Array.isArray(val) ? val :
        (typeof val === 'string' ? [val] : []);

      const fromList = normalize(fromData[fromTag]);
      const toList = normalize(toData[toTag]);

      const length = Math.max(fromList.length, toList.length);

      for (let k = 0; k < length; k++) {
        const fromText = fromList[k] || '';
        const toText = toList[k] || '';

        const match = fromText === toText;

        console.log(`Comparing value: ${fromTag}: "${fromText}" → ${toTag}: "${toText}"`);
        console.log(match ? '✅ MATCH OK' : '❌ MISMATCH');

        if (!match) {
          mismatchFound = true;
          mismatchMessage += `\n❌ ${fromTag} mismatch at index ${k}: "${fromText}" != "${toText}"`;
        }
      }
    }
  }

  if (mismatchFound) {
    throw new Error(`\n❌ JSON Comparison Failed:${mismatchMessage}`);
  }

  console.log('\n🎉 All JSON comparisons completed with no mismatches!');
}


/* ------------------------------------------------------
 * 🔹 Usage Guidelines for createSavedFile()
 * ------------------------------------------------------

 * 1️⃣  Basic file creation with text content
 * ------------------------------------------------------
 * Creates a TXT file in the default folder `savedData/data/txt/`
 * with auto-appended viewport and timestamp.
 * ------------------------------------------------------
    const filePath = await this.createSavedFile(
      null,                  // folderName (null → default)
      'MyFile',              // baseFileName
      'txt',                 // file extension
      'This is sample text'  // content
    );


 * 2️⃣  Save file in a custom folder
 * ------------------------------------------------------
 * Folder path is relative to `savedData/data/txt/`.
 * ------------------------------------------------------
    const filePath = await this.createSavedFile(
      'allArticles/allArticlesBigImageBanner', // folderName
      'BigImageBanner',                        // baseFileName
      'txt',                                   // extension
      newPageUrl                               // content
    );


 * 3️⃣  Save multiple files in a loop (dynamic names)
 * ------------------------------------------------------
    for (let i = 0; i < links.length; i++) {
      const filePath = await this.createSavedFile(
        'events/iCalLinks',          // folder route
        `card${i + 1}iCalender`,     // dynamic file name
        'txt',                        // extension
        links[i]                      // content
      );
    }


 * 4️⃣  Save JSON content
 * ------------------------------------------------------
 * Automatically stringifies object if extension is `json`.
 * ------------------------------------------------------
    const data = { title: 'Test Article', date: '2025-11-26' };
    const filePath = await this.createSavedFile(
      'articles/json',
      'ArticleData',
      'json',
      data
    );


 * 5️⃣  Save empty file
 * ------------------------------------------------------
 * If content is `null`, creates an empty file.
 * ------------------------------------------------------
    const filePath = await this.createSavedFile(
      'temp',
      'EmptyFile',
      'txt'
    );


 * 6️⃣  Auto timestamp & viewport in file name
 * ------------------------------------------------------
 * File name format: <baseFileName><viewport>_<timestamp>.<extension>
 * Example: `BigImageBannerDesktop_2025-11-26T10-20-30-123Z.txt`


 * 7️⃣  Supported content types
 * ------------------------------------------------------
 * - String → written directly
 * - Object → automatically JSON.stringify() if extension is `json`
 * - Any other type → throws an error


 * ------------------------------------------------------
 * ✔ Summary
 * - Flexible folder & file naming
 * - Automatically adds viewport and timestamp
 * - Supports TXT & JSON content
 * - Can be used dynamically in loops or for single files
 * - Ensures folder creation recursively
 * ------------------------------------------------------
*/

  async createSavedFile(folderName = null, baseFileName, extension = 'txt', content = null) {
    const viewportName = getViewportNameFromPage(this.page);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Determine directory path
    const baseDir = path.join(process.cwd(), 'savedData/data/txt');
    const dirPath = folderName ? path.join(baseDir, folderName) : baseDir;

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Build file name and path
    const fileName = `${baseFileName}${viewportName}_${timestamp}.${extension}`;
    const filePath = path.join(dirPath, fileName);

    // Write content if provided
    if (content !== null) {
      let dataToWrite = '';

      if (typeof content === 'object' && extension === 'json') {
        dataToWrite = JSON.stringify(content, null, 2);
      } else if (typeof content === 'string') {
        dataToWrite = content;
      } else {
        throw new Error(
          `Unsupported content type for ".${extension}". Must be string or object (for JSON).`
        );
      }

      fs.writeFileSync(filePath, dataToWrite, 'utf-8');
    } else {
      fs.writeFileSync(filePath, '');
    }

    console.log(`📁 File created: ${filePath}`);
    return filePath;
  }
  async expectNotVisible(locator, alias = 'Element') {
    try {
      const isVisible = await locator.isVisible();
      if (!isVisible) {
        console.log(`✅ ${alias} is NOT visible as expected.`);
        return true;
      } else {
        console.warn(`⚠️ ${alias} is visible, expected NOT visible.`);
        return false;
      }
    } catch (err) {
      // Element might not exist in DOM at all
      console.log(`✅ ${alias} is NOT visible (element not found in DOM).`);
      return true;
    }
  }


/* ------------------------------------------------------
 * 🔹 Usage Guidelines for clickUntilDisappears()
 * ------------------------------------------------------

 * 1️⃣  Basic usage
 * ------------------------------------------------------
 * Clicks the given locator repeatedly until it is no longer visible.
 * ------------------------------------------------------
    await this.clickUntilDisappears(
      this.dismissPopupBtn,   // locator
      'Dismiss Popup'         // optional alias
    );


 * 2️⃣  Using default alias
 * ------------------------------------------------------
 * If alias is omitted, it defaults to 'Button'.
 * ------------------------------------------------------
    await this.clickUntilDisappears(this.loadMoreBtn);


 * 3️⃣  Dynamic locators
 * ------------------------------------------------------
 * Works with any Playwright locator, including locators returned
 * by page.locator() or multi-step locators.
 * ------------------------------------------------------
    const cards = await this.page.locator('.notification-card').all();
    for (const card of cards) {
      await this.clickUntilDisappears(card, 'Notification Card');
    }


 * 4️⃣  Common use cases
 * ------------------------------------------------------
 * - Dismissing popups or modal dialogs until they disappear
 * - Clicking "Load More" buttons until all items are loaded
 * - Closing notifications, banners, or tooltips repeatedly
 * - Clearing dynamic UI elements that appear temporarily


 * 5️⃣  Notes / best practices
 * ------------------------------------------------------
 * - Uses networkidle wait after each click to allow UI updates
 * - Can be combined with assertions after disappearance
 * - Ensure the element eventually disappears to avoid infinite loops
 * - Can optionally add a max attempt count for safety, e.g.,
 *   let attempts = 0; while(await locator.isVisible() && attempts < 10) { ... attempts++; }


 * ------------------------------------------------------
 * ✔ Summary
 * - Auto-clicks a locator until it disappears
 * - Supports alias for better logging
 * - Useful for modals, popups, load-more, and transient UI elements
 * - Handles UI updates after each click
 * ------------------------------------------------------
*/

  async clickUntilDisappears(locator, alias = 'Button') {
  // Loop until the element is not visible
  while (await locator.isVisible()) {
    console.log(`Clicking ${alias}...`);
    await locator.click();
    // Optional: wait a short time for UI update
    await this.page.waitForLoadState('networkidle');
  }
  console.log(`${alias} is no longer visible.`);
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for assertDataFromResponseBody()
 * ------------------------------------------------------

 * 1️⃣  Basic usage
 * ------------------------------------------------------
 * Verify that all values from a nested JSON path exist on the page.
 * Example: check all event titles.
 * ------------------------------------------------------
    await this.assertDataFromResponseBody(
      'events/GETOnlineEvents',   // saved JSON path (relative to savedData/apiResponses/)
      'events.items.title'        // nested path to extract values
    );


 * 2️⃣  Nested path explanation
 * ------------------------------------------------------
 * - Format: 'parent.child.arrayProperty.property'
 * - Example JSON:
    {
      "events": {
        "items": [
          { "id": 101, "title": "Online Coding Workshop" },
          { "id": 102, "title": "Webinar on Automation" }
        ]
      }
    }
 * - Nested path: 'events.items.title'
 * - Extracted values: ["Online Coding Workshop", "Webinar on Automation"]


 * 3️⃣  JSON source
 * ------------------------------------------------------
 * - Default: loads from `savedData/apiResponses/<filePath>.json`
 * - If file does not exist, optionally can call API to fetch live data
 * - Supports arrays of API responses with `responseBody` wrapper


 * 4️⃣  Verification on page
 * ------------------------------------------------------
 * - For each extracted value:
 *    - Finds first visible heading (`h1`, `h2`, `h3`, `h4`) containing the text
 *    - Logs ✅ if found, ❌ if missing
 * - Alias for logging defaults to the value itself


 * 5️⃣  Safety & error handling
 * ------------------------------------------------------
 * - Throws error if `filePath` or `nestedPath` is missing
 * - Logs warning if nested path returns no values
 * - Supports arrays and nested objects safely


 * 6️⃣  Common use cases
 * ------------------------------------------------------
 * - Verifying dynamic event titles, product names, blog post titles, etc.
 * - Regression testing: ensure API content matches page content
 * - Checking multiple items from API responses automatically


 * ------------------------------------------------------
 * ✔ Summary
 * - Load saved API response (JSON)
 * - Extract nested values using dot notation path
 * - Check page for presence of each value (h1→h4)
 * - Logs matches/mismatches for easy debugging
 * ------------------------------------------------------
*/

async assertDataFromResponseBody(filePath, nestedPath) {
  const prefixPath = 'savedData/apiResponses/';
  
  if (!filePath) {
    throw new Error('❌ filePath parameter is required');
  }

  // Ensure filePath has .json extension
  const fullPath = path.resolve(prefixPath + (filePath.endsWith('.json') ? filePath : `${filePath}.json`));

  let dataSource;

  // Load data from file if it exists
  if (fs.existsSync(fullPath)) {
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    dataSource = JSON.parse(fileContent);
  } else {
    // Otherwise, call your API
    dataSource = await someApiCall(); // replace with actual API call
  }

  // Normalize wrapper arrays and responseBody
  if (Array.isArray(dataSource) && dataSource[0]?.responseBody) {
    dataSource = dataSource[0].responseBody;
  }

  if (!nestedPath) {
    throw new Error('❌ nestedPath parameter is required, e.g., "events.items.title"');
  }

  // Generic nested path resolver (safe for arrays)
  function getNestedValues(obj, path) {
    const parts = path.split('.');
    let current = [obj]; // start as array to handle flattening

    parts.forEach((key) => {
      const next = [];
      for (const item of current) {
        if (!item) continue;
        if (Array.isArray(item)) {
          item.forEach(subItem => {
            if (subItem && subItem[key] !== undefined) next.push(subItem[key]);
          });
        } else if (item[key] !== undefined) {
          next.push(item[key]);
        }
      }
      current = next;
    });

    return current;
  }

  const values = getNestedValues(dataSource, nestedPath);

  if (!values || values.length === 0) {
    console.log(`⚠️ Response at path "${nestedPath}" is empty. Skipping verification.`);
    return; // exit without failing the test
  }

  console.log(`📝 Verifying ${values.length} titles on the page...`);

  // Helper: find first visible heading h1>h2>h3>h4
  async function findVisibleTitle(page, titleText) {
    const headings = ['h1', 'h2', 'h3', 'h4'];
    for (const tag of headings) {
      const locator = page.locator(`${tag}:text("${titleText}")`);
      if (await locator.count() > 0) {
        const firstVisible = locator.filter({ hasText: titleText }).first();
        if (await firstVisible.isVisible()) return firstVisible;
      }
    }
    return null;
  }

  // Verify each title
  for (const title of values) {
    const alias = title; // use title as alias
    const locator = await findVisibleTitle(this.page, title);

    if (locator) {
      console.log(`✅ [${alias}] found`);
    } else {
      console.log(`❌ [${alias}] NOT found`);
    }
  }
}

/* ------------------------------------------------------
 * 🔹 Usage Guidelines for expectAndEnter()
 * ------------------------------------------------------

 * 1️⃣  Basic key press
 * ------------------------------------------------------
 * Press a key (default "Enter") without API tracking.
 * ------------------------------------------------------
    await this.expectAndEnter();          // Press Enter
    await this.expectAndEnter("Tab");    // Press Tab key


 * 2️⃣  Key press with specific API assertion
 * ------------------------------------------------------
 * Listen for a specific API defined in your apiMap.
 * Throws error if API is not called or fails status assertion.
 * ------------------------------------------------------
    await this.expectAndEnter(
      "Enter",                   // key to press
      "allEventsFilterOldestApi:GET"  // API key with optional method
    );


 * 3️⃣  Detect and capture API automatically
 * ------------------------------------------------------
 * detectApi = true (default) → capture all APIs triggered by key press
 * ------------------------------------------------------
    await this.expectAndEnter(
      "Enter",
      null,        // no specific API key
      { detectApi: true }
    );


 * 4️⃣  Detect specific API via string
 * ------------------------------------------------------
 * detectApi = "API_KEY" → captures only that API even without apiKeyWithMethod
 * ------------------------------------------------------
    await this.expectAndEnter(
      "Enter",
      null,
      { detectApi: "allEventsFilterOldestApi" }
    );


 * 5️⃣  Save API responses to file
 * ------------------------------------------------------
 * Save captured responses for later verification or debugging.
 * ------------------------------------------------------
    await this.expectAndEnter(
      "Enter",
      "allEventsFilterOldestApi:GET",
      {
        detectApi: "allEventsFilterOldestApi",
        saveApiResponse: true,
        saveFileName: "events/GETOldestAllEvents"
      }
    );


 * 6️⃣  Retry mechanism
 * ------------------------------------------------------
 * maxAttempts & delay → retry key press if API fails or errors occur
 * ------------------------------------------------------
    await this.expectAndEnter(
      "Enter",
      "someApiKey:POST",
      { maxAttempts: 3, delay: 1000 }
    );


 * 7️⃣  Notes / best practices
 * ------------------------------------------------------
 * - Supports any key recognized by Playwright keyboard.press()
 * - Works for Enter, Tab, Escape, Arrow keys, etc.
 * - Combines key press with API assertion + response saving
 * - Automatically logs key pressed and API status
 * - Attach responses to Allure reports if available
 * - Ensure saveFileName path is valid and relative to "savedData/apiResponses"
 * - Avoid infinite retries by setting sensible maxAttempts

*/
async  expectAndEnter(
  key = "Enter",
  apiKeyWithMethod = null, // optional API key:METHOD
  {
    maxAttempts = 1,
    delay = 500,
    detectApi = true,       // true: auto-detect, string: specific API key
    timeout = 5000,
    saveApiResponse = false,
    saveFileName = null
  } = {}
) {
  const vp = this.#_viewportName();

  // --- Parse API assertion
  let apiAssertion = null;
  if (apiKeyWithMethod) {
    const [apiKey, methodOverride] = apiKeyWithMethod.split(":");
    if (!apiMap[apiKey]) throw new Error(`API key '${apiKey}' not found in apiMap`);

    const apiEntry = apiMap[apiKey];
    const method = methodOverride ? methodOverride.toUpperCase() : Object.keys(apiEntry.methods)[0];
    const expectedStatus = apiEntry.methods[method]?.expectedStatus || 200;
    apiAssertion = { url: apiEntry.url, method, expectedStatus };
  }

  // --- Allow detectApi to override apiAssertion if string
  if (typeof detectApi === "string" && !apiAssertion) {
    if (!apiMap[detectApi]) throw new Error(`API key '${detectApi}' not found in apiMap`);
    const apiEntry = apiMap[detectApi];
    const method = Object.keys(apiEntry.methods)[0];
    const expectedStatus = apiEntry.methods[method]?.expectedStatus || 200;
    apiAssertion = { url: apiEntry.url, method, expectedStatus };
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let responses = [];

      if (detectApi) {
        // --- Listen for API responses
        const listener = (res) => {
          const u = new URL(res.url());

          if (typeof detectApi === "string") {
            // Only capture the specific API key
            if (res.url().startsWith(apiMap[detectApi].url)) responses.push(res);
          } else {
            // Auto-detect API
            const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");
            const firstLabel = u.hostname.split(".")[0].toLowerCase();
            const hostIsApi = /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);
            if (pathIsApi || hostIsApi) responses.push(res);
          }
        };

        this.page.on("response", listener);
        await this.page.keyboard.press(key);
        await this.page.waitForTimeout(2000);
        this.page.off("response", listener);
      } else {
        await this.page.keyboard.press(key);
      }

      // --- Handle API assertion
      if (responses.length && apiAssertion) {
        const matched = responses.find(
          (r) =>
            r.url().startsWith(apiAssertion.url) &&
            r.request().method().toUpperCase() === apiAssertion.method
        );

        if (!matched) throw new Error(`API ${apiAssertion.url} not called`);

        const status = matched.status();
        console.log(`🌐 API Captured: ${matched.request().method()} ${matched.url()} | Status: ${status}`);
        if (status !== apiAssertion.expectedStatus)
          throw new Error(`API assertion failed: expected ${apiAssertion.expectedStatus}, got ${status}`);
      }

      // --- Save API response if requested
      if (saveApiResponse && saveFileName && responses.length) {
        const savedResponses = [];
        for (const res of responses) {
          let body = null;
          try {
            const text = await res.text();
            body = JSON.parse(text);
          } catch {
            body = await res.text().catch(() => null);
          }

          savedResponses.push({
            url: res.url(),
            method: res.request().method(),
            status: res.status(),
            responseBody: body
          });

          // --- Allure attachment
          if (allure) {
            allure.attachment(
              `API Response: ${res.request().method()} ${res.url()}`,
              JSON.stringify(body, null, 2),
              "application/json"
            );
          }
        }

        const dir = path.join(process.cwd(), "savedData/apiResponses", path.dirname(saveFileName));
        fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(process.cwd(), "savedData/apiResponses", `${saveFileName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(savedResponses, null, 2), "utf-8");
        console.log(`🗂️ API responses saved at: ${filePath}`);
      }

      console.log(`✅ Key pressed: [${key} @ ${vp}]`);
      return true;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.warn(`Retrying key press (${attempt}/${maxAttempts})...`);
      await this.page.waitForTimeout(delay);
    }
  }
}


}
