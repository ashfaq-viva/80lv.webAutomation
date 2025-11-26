import { chromium } from '@playwright/test';
import { config } from '../config/testConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/LoginPage.js';
import { ENV, BASE_URL } from '../playwright.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, retries = 3) {
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`🔐 [${role}] Attempt ${attempt}/${retries}`);

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await loginPage.globalLogin(email, password);

      await page.waitForFunction(() => document.cookie.includes('token='), { timeout: 10000 });

      const cookies = await context.cookies();
      const tokenCookie = cookies.find(c => c.name === 'token');

      if (!tokenCookie) {
        if (attempt === retries) throw new Error(`❌ Token cookie not found for ${role} after ${retries} retries`);
        console.warn(`⚠️ Token not found, retrying in 2s...`);
        await page.waitForTimeout(2000);
        continue;
      }

      const token = tokenCookie.value;

      fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
      fs.writeFileSync(tokenPath, JSON.stringify({ token, cookies }, null, 2));
      fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });
      fs.writeFileSync(lockFilePath, 'done');

      console.log(`✅ Token & cookies saved for ${role}`);
      await page.close();
      return; // success
    } catch (err) {
      if (attempt === retries) {
        console.error(`❌ Failed after ${retries} attempts: ${err.message}`);
        throw err;
      }
      console.warn(`⚠️ Login attempt ${attempt} failed for ${role}, retrying...`);
      await page.waitForTimeout(2000);
    }
  }
}

async function globalSetup() {
  console.log('TC_001:Global setup---------');
  console.log(`🌍 Using ENV: ${ENV}, baseURL: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true,
  });

  const usersToLogin = ['talent', 'company'];

  for (const role of usersToLogin) {
    const email = config.credentials[`${role}Email`];
    const password = config.credentials[`${role}Password`];

    const tokenDir = path.resolve(`./tokens&cookies_${ENV}`);
    const tokenPath = path.join(tokenDir, `${role}.json`);
    const lockFilePath = path.resolve(`./locks/setup-${role}.lock`);

    if (fs.existsSync(tokenPath) && fs.existsSync(lockFilePath)) {
      console.log(`✅ ${role}: Token already exists. Skipping.`);
      continue;
    }

    console.log(`🔐 Logging in as ${role}: ${email}`);

    const artBase = path.resolve(`./artifacts/global-setup/${role}`);
    fs.mkdirSync(artBase, { recursive: true });

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: { dir: path.join(artBase, 'video') },
    });

    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    try {
      await loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, 3);

      try {
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
      } catch {}
      await context.close();
    } catch (err) {
      console.error(`❌ Global setup failed for ${role}:`, err?.message || err);

      try {
        const page = await context.newPage();
        await page.screenshot({ path: path.join(artBase, 'page.png'), fullPage: true });
        fs.writeFileSync(path.join(artBase, 'page.html'), await page.content());
      } catch {}
      try {
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
      } catch {}
      await context.close();
      throw err;
    }
  }

  await browser.close();
}

export default globalSetup;

