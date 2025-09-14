// // globalSetup.js
// import { chromium } from '@playwright/test';
// import { config } from '../config/testConfig.js';
// import fs from 'fs';
// import path from 'path';
// import { LoginPage } from '../pages/LoginPage.js';
// import pwConfig, { ENV, BASE_URL } from '../playwright.config.js';

// async function globalSetup() {
//   console.log(ENV + ' Global setup-------------------------');
//   console.log(`🌍 Using ENV: ${ENV}, baseURL: ${BASE_URL}`);

//   const browser = await chromium.launch({ headless: process.env.CI ? true : false, ignoreHTTPSErrors: true });
//   const usersToLogin = ['talent', 'recruiter'];

//   for (const role of usersToLogin) {
//     const email = config.credentials[`${role}Email`];
//     const password = config.credentials[`${role}Password`];

//      const tokenDir = `./tokens&cookies_${ENV}`;
//     const tokenPath = path.resolve(`${tokenDir}/${role}.json`);
//     const lockFilePath = path.resolve(`./locks/setup-${role}.lock`);

//     if (fs.existsSync(tokenPath) && fs.existsSync(lockFilePath)) {
//       console.log(`✅ ${role}: Token already exists. Skipping.`);
//       continue;
//     }

//     console.log(`🔐 Logging in as ${role}: ${email}`);
//     const context = await browser.newContext({ ignoreHTTPSErrors: true });
//     const page = await context.newPage();
//     const loginPage = new LoginPage(page);

//     await page.goto(BASE_URL);
//     await loginPage.globalLogin(email, password);
//     await page.waitForTimeout(5000);

//     // Grab token from cookies
//     const cookies = await context.cookies();
//     // console.log(cookies.map(c => c.name));

//     const tokenCookie = cookies.find(c => c.name === 'token');
//     if (!tokenCookie) {
//       throw new Error(`❌ Token cookie not found for ${role}.`);
//     }

//   const token = tokenCookie.value;

//   fs.mkdirSync(path.dirname(tokenPath), { recursive: true });

//   // ✅ Save both cookies + token
//   fs.writeFileSync(
//     tokenPath,
//     JSON.stringify({ token, cookies }, null, 2)
//   );

//   fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });
//   fs.writeFileSync(lockFilePath, 'done');
//   console.log(`✅ Token & cookies saved for ${role}`);

//       await context.close();
//     }

//     await browser.close();
//   }

// export default globalSetup;
// globalSetup.js
import { chromium } from '@playwright/test';
import { config } from '../config/testConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/LoginPage.js';
import pwConfig, { ENV, BASE_URL } from '../playwright.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup() {
  console.log(ENV + ' Global setup-------------------------');
  console.log(`🌍 Using ENV: ${ENV}, baseURL: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true,
  });

  const usersToLogin = ['talent', 'recruiter'];

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

    // per-role artifact folders (safe to upload)
    const artBase = path.resolve(`./artifacts/global-setup/${role}`);
    fs.mkdirSync(artBase, { recursive: true });

    // record trace & video for debugging CI-only flakiness
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: { dir: path.join(artBase, 'video') },
    });

    // Trace: start ASAP
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await loginPage.globalLogin(email, password);
      await page.waitForTimeout(3000);

      const cookies = await context.cookies();
      const tokenCookie = cookies.find(c => c.name === 'token');
      if (!tokenCookie) {
        throw new Error(`❌ Token cookie not found for ${role}.`);
      }

      const token = tokenCookie.value;

      fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
      fs.writeFileSync(tokenPath, JSON.stringify({ token, cookies }, null, 2));
      fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });
      fs.writeFileSync(lockFilePath, 'done');

      console.log(`✅ Token & cookies saved for ${role}`);
    } catch (err) {
      console.error(`❌ Global setup failed for ${role}:`, err?.message || err);

      // Dump artifacts for debugging
      try {
        await page.screenshot({ path: path.join(artBase, 'page.png'), fullPage: true });
      } catch {}
      try {
        fs.writeFileSync(path.join(artBase, 'page.html'), await page.content());
      } catch {}
      try {
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
      } catch {}

      await context.close(); // flush video
      throw err; // fail setup so CI shows red
    }

    // On success, stop trace & close context to flush video
    try {
      await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
    } catch {}
    await context.close();
  }

  await browser.close();
}

export default globalSetup;


