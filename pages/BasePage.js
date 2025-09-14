import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';
import { getViewportNameFromPage } from '../utils/viewports.js';
import { allure } from 'allure-playwright';

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

  // 🔹 Accept a single locator OR a map of { default, Desktop, Laptop, Tablet, Mobile }
  #_resolveLocator(locatorOrMap) {
    // single locator?
    if (locatorOrMap && typeof locatorOrMap.click === 'function' && typeof locatorOrMap.waitFor === 'function') {
      return locatorOrMap;
    }
    const vp = this.#_viewportName();
    const map = locatorOrMap || {};
    return map[vp] || map.default || map.Desktop || map.Laptop || map.Tablet || map.Mobile;
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
  {
    maxAttempts = 1,
    delay = 500,
    detectApi = true,   // 👈 auto-detect API calls
    timeout = 5000      // 👈 configurable timeout
  } = {}
) {
  const locator = this.#_resolveLocator(locatorOrMap);
  if (!locator) throw new Error(`expectAndClick: no locator resolved for [${alias}]`);
  const vp = this.#_viewportName();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await locator.waitFor({ state: "visible", timeout: this.defaultTimeout });

      const text =
        (await locator.innerText().catch(() => ""))?.trim() ||
        (await locator.getAttribute("aria-label").catch(() => "")) ||
        (await locator.getAttribute("alt").catch(() => "")) ||
        alias;

      let response = null;

      if (detectApi) {
        try {
          // race: click + wait for response where URL contains "api"
          const results = await Promise.allSettled([
            this.page.waitForResponse(
              res => {
                const u = new URL(res.url());
                // (A) path starts with /api...
                const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");

                // (B) first label of hostname is api-like:
                // - "api", "api-xxx", "api2", "api2-xxx"  → ^api(\d+)?(?:$|-)
                // - "xxx-api"                              → -api$
                const firstLabel = u.hostname.split(".")[0].toLowerCase();
                const hostIsApi =
                  /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);

                return pathIsApi || hostIsApi;
              },
              { timeout }
            ),
            locator.click(),
          ]);

          const resResult = results.find(r => r.status === "fulfilled" && r.value?.url);
          response = resResult?.value || null;
        } catch (e) {
          response = null;
        }
      } else {
        await locator.click();
      }

      if (response) {
        const url = response.url();
        const method = response.request().method();
        const headers = response.request().headers();
        const postData = response.request().postData();
        const status = response.status();

        let bodyText = null;
        try {
          bodyText = await response.text();
        } catch {
          bodyText = null;
        }

        console.log(`🌐 Captured API → ${method} ${url} | Status: ${status}`);

        // --- Attach curl
        const curl = [
          `curl -X ${method}`,
          ...Object.entries(headers).map(([k, v]) => `-H "${k}: ${v}"`),
          postData ? `-d '${postData}'` : "",
          `'${url}'`
        ]
          .filter(Boolean)
          .join(" \\\n  ");

        await allure.attachment("API Request (cURL)", Buffer.from(curl, "utf-8"), "text/plain");

        // --- Attach response
        if (bodyText) {
          let prettyJson;
          try {
            prettyJson = JSON.stringify(JSON.parse(bodyText), null, 2);
          } catch {
            prettyJson = bodyText;
          }

          await allure.attachment(
            "API Response",
            Buffer.from(prettyJson, "utf-8"),
            "application/json"
          );
        }
      }

      console.log(`✅ Clicked [${alias} @ ${vp}] → "${text}"`);
      return true;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.warn(`Retrying click (${attempt}/${maxAttempts}) for [${alias} @ ${vp}]...`);
      await this.page.waitForTimeout(delay);
    }
  }
}


  async waitAndFill(locatorOrMap, value, alias = 'element', timeout = this.defaultTimeout) {
    const locator = this.#_resolveLocator(locatorOrMap);
    if (!locator) throw new Error(`waitAndFill: no locator resolved for [${alias}]`);
    const vp = this.#_viewportName();

    await locator.waitFor({ state: 'visible', timeout });
    const label =
      (await locator.getAttribute('name').catch(() => '')) ||
      (await locator.getAttribute('placeholder').catch(() => '')) ||
      (await locator.innerText().catch(() => '')).trim();

    console.log(`✅ Filled [${alias} @ ${vp}] → "${label || 'Unnamed field'}" with: "${value}"`);
    await locator.fill(value);
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

async assert(options = {}) {
  const {
    locator,
    selector,
    state,
    toHaveText,
    toContainText,
    toHaveURL,
    count,
    toHaveValue,
    toHaveAttribute,
    alias = 'locator'   // 👈 NEW default alias
  } = options;

  const target = locator || (selector && this.page.locator(selector));
  if (!target && !toHaveURL) {
    throw new Error('❌ You must provide either a locator or a selector');
  }

  if (target && state) {
    await expect(target).toBeVisible({ timeout: this.defaultTimeout });
    console.log(`✅ Assert: element is visible [${alias}]`);
  }

  if (target && toHaveText) {
    await expect(target).toHaveText(toHaveText);
    console.log(`✅ Assert: element [${alias}] has exact text "${toHaveText}"`);
  }

  if (target && toContainText) {
    await expect(target).toContainText(toContainText);
    console.log(`✅ Assert: element [${alias}] contains text "${toContainText}"`);
  }

  if (target && typeof count === 'number') {
    await expect(target).toHaveCount(count);
    console.log(`✅ Assert: element [${alias}] count is ${count}`);
  }

  if (target && toHaveValue) {
    await expect(target).toHaveValue(toHaveValue);
    console.log(`✅ Assert: element [${alias}] has value "${toHaveValue}"`);
  }

  if (target && toHaveAttribute) {
    const [attr, value] = Object.entries(toHaveAttribute)[0];
    await expect(target).toHaveAttribute(attr, value);
    console.log(`✅ Assert: element [${alias}] has attribute [${attr}] = "${value}"`);
  }

  if (toHaveURL) {
    await expect(this.page).toHaveURL(toHaveURL);
    console.log(`✅ Assert: page URL is "${toHaveURL}"`);
  }
}
}
