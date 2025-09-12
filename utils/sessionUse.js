// fixtures/sessionUse.js
import { test as base } from '../lib/BaseTest.js';
import fs from 'fs';
import path from 'path';
import pwConfig, { ENV } from '../playwright.config.js';

// 🔹 Helper to parse domain host
function getHost() {
  const baseURL = pwConfig?.use?.baseURL;
  if (!baseURL) throw new Error('playwright.config.js → use.baseURL is missing.');
  return new URL(baseURL).host; // e.g. "80.lv"
}

// 🔹 Read token + cookies from saved file
function readSession(role) {
  const tokenPath = path.resolve(`./tokens&cookies_${ENV}/${role}.json`);
  if (!fs.existsSync(tokenPath)) {
    throw new Error(`Token file not found for role: ${role}. Run globalSetup first.`);
  }
  const { token, cookies } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  if (!token || !cookies) throw new Error(`Invalid session data for role: ${role}.`);
  return { token, cookies };
}

// 🔹 Fixture to inject session inside test
export const test = base.extend({
  useSession: async ({ context, page }, use) => {
    const fn = async (role /* 'talent' | 'recruiter' */) => {
      const { token, cookies } = readSession(role);
      const host = getHost();

      // Reset and apply cookies
      await context.clearCookies();
      await context.addCookies(cookies);

      // Mirror token into localStorage as fallback
      await page.addInitScript(v => {
        try { localStorage.setItem('authToken', v); } catch {}
      }, token);

      console.log(`✅ Restored session for ${role} on ${host}`);
    };

    await use(fn);
  },
});

// // utils/sessionUse.js
// import { test as base } from '../lib/BaseTest.js';
// import fs from 'fs';
// import path from 'path';
// import pwConfig from '../playwright.config.js';

// // Helper: get domain host
// function getHost() {
//   const baseURL = pwConfig?.use?.baseURL;
//   if (!baseURL) throw new Error('playwright.config.js → use.baseURL is missing.');
//   return new URL(baseURL).host; // e.g. "80.lv"
// }

// // Helper: read saved session
// function readSession(role) {
//   const tokenPath = path.resolve(`./tokens/${role}.json`);
//   if (!fs.existsSync(tokenPath)) {
//     throw new Error(`Token file not found for role: ${role}. Run globalSetup first.`);
//   }
//   const { token, cookies } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
//   if (!token || !cookies) throw new Error(`Invalid session data for role: ${role}.`);
//   return { token, cookies };
// }

// // Fixture
// export const test = base.extend({
//   useSession: async ({ context, page }, use) => {
//     const fn = async (role = 'talent') => {
//       const host = getHost();

//       if (role === 'noSession' || role === 'none') {
//         await context.clearCookies();
//         await page.addInitScript(() => localStorage.clear());
//         console.log(`🚪 Started as guest (no session) on ${host}`);
//         return;
//       }

//       const { token, cookies } = readSession(role);

//       await context.clearCookies();
//       await context.addCookies(cookies);

//       await page.addInitScript(v => {
//         try { localStorage.setItem('authToken', v); } catch {}
//       }, token);

//       console.log(`✅ Restored session for ${role} on ${host}`);
//     };

//     await use(fn);
//   },
// });




