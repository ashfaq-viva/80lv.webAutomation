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
    detectApi = true,   // auto-detect API calls
    timeout = 5000      // configurable timeout
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

  if (detectApi && i === locators.length - 1) {
    try {
      if (apiAssertion) {
        // Keep single API logic for apiAssertion
        const waitForResponseFn = (response) =>
          response.url().startsWith(apiAssertion.url) &&
          response.request().method().toUpperCase() === apiAssertion.method;

        const results = await Promise.allSettled([
          locator.click(),
          this.page.waitForResponse(waitForResponseFn, { timeout }),
        ]);
        response = results.find((r) => r.status === "fulfilled" && r.value?.url)?.value || null;

      } else {
        // --- CHANGE: capture ALL APIs
        const collectedResponses = [];
        const listener = (response) => {
          const u = new URL(response.url());
          if (u.hostname.includes("cdn.80.lv")) return;
          if (u.hostname.includes("consent-api.xsolla.com")) return;
          if (u.href.includes("/api/updpromos")) return;
          if (u.href.includes("/upload/promo")) return;
          if (u.href.includes("/upload/post")) return;
          if (u.href.includes("/upload/vendor")) return;
          if (u.href.includes("/updpromos")) return;
          if (u.href.includes("/upload")) return;
          const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");
          const firstLabel = u.hostname.split(".")[0].toLowerCase();
          const hostIsApi = /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);
          if (pathIsApi || hostIsApi) collectedResponses.push(response);
        };

        this.page.on("response", listener);
        await locator.click();
        await this.page.waitForTimeout(1000); // small wait to catch all APIs
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

      if (response && apiAssertion) {
  // single API assertion
  const actualStatus = response.status();
  console.log(`🌐 Captured API: ${response.url()} → Method: ${response.request().method()} | Status: ${actualStatus}`); 
  console.log(`🔗 Expected API: ${apiAssertion.url} → Method: ${apiAssertion.method} | Status: ${apiAssertion.expectedStatus}`); 
  const passed = actualStatus === apiAssertion.expectedStatus; 
  console.log(`✅Assertion API: ${passed ? "Passed " : "Failed ❌"}`);
  if (!passed) throw new Error(`API assertion failed for ${apiAssertion.url}`);
} else if (response) {
  // --- FIX: handle array of responses
  const responses = Array.isArray(response) ? response : [response];
  responses.forEach((res) => {
    console.log(`🌐 Captured API → ${res.request().method()} ${res.url()} | Status: ${res.status()}`);
  });
}

      // --- Allure attachments
if (response) {
  const responses = Array.isArray(response) ? response : [response];

  for (const res of responses) {
    const req = res.request();
    const curl = [
      `curl -X ${req.method()}`,
      ...Object.entries(req.headers()).map(([k, v]) => `-H "${k}: ${v}"`),
      req.postData() ? `-d '${req.postData()}'` : "",
      `'${res.url()}'`,
    ]
      .filter(Boolean)
      .join(" \\\n  ");

    await allure.attachment("API Request (cURL)", Buffer.from(curl, "utf-8"), "text/plain");

    let bodyText = null;
    try { bodyText = await res.text(); } catch {}
    if (bodyText) {
      let pretty;
      try { pretty = JSON.stringify(JSON.parse(bodyText), null, 2); } catch { pretty = bodyText; }
      await allure.attachment("API Response", Buffer.from(pretty, "utf-8"), "application/json");
    }
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

async assert(options = {},page = this.page) {
  const {
    locator: locatorOrMap,
    state,
    toHaveText,
    toContainText,
    toHaveURL,
    count,
    toHaveValue,
    toHaveAttribute,
    toHaveCSS,
    alias = 'locator',
  } = options;

  const locators = this.#_resolveLocator(locatorOrMap); // resolves viewport-specific
  if (!(locators && locators.length) && !toHaveURL) {
    throw new Error(`❌ assert: no locator(s) resolved for [${alias}]`);
  }

  const vp = this.#_viewportName();
  // const target = locators[locators.length - 1]; // always last element for assertion
const target = (locators && locators.length) ? locators[locators.length - 1] : null;
  // Click intermediate steps if more than 1
  // if (locators.length > 1) {
  if (locators && locators.length > 1) {
    for (let i = 0; i < locators.length - 1; i++) {
      const stepLocator = locators[i];
      const stepAlias = `${alias} (Step ${i + 1})`;

      if (await stepLocator.isVisible()) {
        await stepLocator.scrollIntoViewIfNeeded();
        await stepLocator.click();
        console.log(`✅ Clicked [${stepAlias} @ ${vp}]`);
        await this.page.waitForTimeout(300); // small delay for UI
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

  if (toHaveURL) {
  if (toHaveURL.startsWith('http') || toHaveURL.startsWith(BASE_URL)) {
    const normalize = (url) => url.replace(/\/+$/, ''); // remove trailing slashes
    await expect(normalize(page.url())).toBe(normalize(toHaveURL));
    console.log(`✅ Assert: page URL is "${toHaveURL}" (ignoring trailing slash)`);
  } else {
    await expect(page.url()).toContain(toHaveURL);
    console.log(`✅ Assert: page URL contains "${toHaveURL}"`);
  }
}
if (target && toHaveCSS) {
  for (const [prop, expected] of Object.entries(toHaveCSS)) {
    const actual = await target.evaluate((el, prop) => getComputedStyle(el)[prop], prop);
    if (actual !== expected) {
      throw new Error(`❌ Assert failed: [${alias}] CSS property "${prop}" expected "${expected}", got "${actual}"`);
    }
    console.log(`✅ Assert: element [${alias}] CSS property "${prop}" = "${expected}"`);
  }
}

}
  async extractDetailsAndSaveAsJson(locatorStr, dirName, prefix = 'CardData' , getViewportNameFn,) {
    const locator = this.page.locator(locatorStr);

    // Common text-bearing tags
    const textTags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'div', 'a', 'li', 'strong', 'em', 'blockquote', 'label', 'button'
    ];

    const extractedData = {};

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
    const dirPath = path.resolve(`savedData/${dirName}`);
    const filePath = path.join(dirPath, fileName);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(extractedData, null, 2), 'utf-8');

    console.log(`✅ Extracted and saved data to: ${filePath}`);
    return extractedData;
  }
async assertFromSavedJsonData(relativePathWithPattern, tagsToAssert = []) {
    // Split into folder and file pattern
    const parts = relativePathWithPattern.split('/');
    const folder = parts.slice(0, -1).join('/');
    const filePattern = parts[parts.length - 1];

    const dirPath = path.resolve('savedData', folder);

    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }

    // Find the first file that matches the pattern
    const files = fs.readdirSync(dirPath);
    const matchedFile = files.find(f => f.includes(filePattern) && f.endsWith('.json'));

    if (!matchedFile) {
      throw new Error(`No JSON file found matching "${filePattern}" in ${dirPath}`);
    }

    const filePath = path.join(dirPath, matchedFile);

    // Read and parse JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const savedData = JSON.parse(rawData);

    // Default tags if none specified
    const defaultTags = ['h1','h2','h3','h4','h5','h6','p','span','div','a','li','strong','em','blockquote','label','button'];
    const tags = tagsToAssert.length > 0 ? tagsToAssert : defaultTags;

    // Assert specified tags
    for (const tag of tags) {
      if (savedData[tag]) {
        for (const text of savedData[tag]) {
          if (tag.startsWith('h')) {
            await expect(this.page.getByRole('heading', { name: text })).toBeVisible();
          } else {
            await expect(this.page.locator(`${tag}:has-text("${text}")`)).toBeVisible();
          }
          console.log(`✅ Asserted ${tag}: "${text}"`);
        }
      }
    }

    console.log(`✅ All specified tag assertions passed from file: ${matchedFile}`);
  }
  async createSavedFile(folderName = null, baseFileName, extension = 'txt', content = null) {
    const viewportName = getViewportNameFromPage(this.page);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Determine directory path
    const baseDir = path.join(process.cwd(), 'savedData');
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
}
