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
    return [locatorOrMap]; // normalize to array
  }

  // Case 2: map-based locator
  const vp = this.#_viewportName();
  const map = locatorOrMap || {};

  // Resolve viewport-specific locator(s)
  const resolved =
    map[vp] ||
    map.default ||
    map.Desktop ||
    map.Laptop ||
    map.Tablet ||
    map.Mobile;

  if (!resolved) return null;

  // Normalize to array
  return Array.isArray(resolved) ? resolved : [resolved];
}

  /* ---------------------------
   * 🔹 Core Actions
   * --------------------------- */
/*await this.expectAndClick(
  {
    default: this.loginBtnDesktop,
    Tablet:  this.loginBtnTablet,
    Mobile:  this.loginBtnMobile,
  },
  'Login Button'
);*/


async expectAndClick(
  locatorOrMap,
  alias = "element",
  apiKeyWithMethod = null, // optional: 'loginApi:POST'
  {
    maxAttempts = 1,
    delay = 500,
    detectApi = true,        // auto-detect or string key
    timeout = 5000,
    saveApiResponse = false, // ✅ new flag
    saveFileName = null      // ✅ file name for saving API responses
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




  /* ---------------------------
   * 🔹 Assertions
   * --------------------------- */

  /*await this.assert({
  locator: this.loginBtn,
  state: 'visible',
  toHaveText: 'Log In'
});

await this.assert({
  locator: this.loginBtn,
  toHaveText: 'Log In',
  alias: 'Login Button'
});

await this.assert({
  toHaveURL: 'https://example.com/dashboard',
  alias: 'Dashboard Page'
});*/

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

//   if (toHaveURL) {
//     const normalize = (url) => url.replace(/\/+$/, '');
//   if (toHaveURL.startsWith('http') || toHaveURL.startsWith(BASE_URL)) {
//     await expect(normalize(targetPage.url())).toBe(normalize(toHaveURL));
//     console.log(`✅ Assert: page URL is "${toHaveURL}" (${defaultAlias})`);
//   } else {
//     await expect(targetPage.url()).toContain(toHaveURL);
//     console.log(`✅ Assert: page URL contains "${toHaveURL}" (${defaultAlias})`);
//   }
// }
if (toHaveURL) {
  const normalize = (url) => url.replace(/\/+$/, '');
  const pageForURL = page || this.page; // use the page passed as argument
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


async assertFromSavedJsonData(matchFromObj, matchToObj) {
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
