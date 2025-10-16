import { defineConfig} from '@playwright/test';
import { config as fallback } from './config/testConfig.js';
import dotenv from 'dotenv';
import os from 'os';

dotenv.config();

const ENV = process.env.ENV || '80LV_PROD';
const allowed = ['80LV_PROD', '80LV_QA', '80LV_DEV', 'ADMIN_PROD', 'ADMIN_QA'];
if (!allowed.includes(ENV)) {
  console.error('Please provide a correct environment value from testConfig');
  process.exit(1);
}

const baseUrlMap = {
  "80LV_PROD": process.env.BASE_URL_80LV_PROD,
  "80LV_QA":   process.env.BASE_URL_80LV_QA,
  "80LV_DEV":  process.env.BASE_URL_80LV_DEV,
  "ADMIN_PROD": process.env.ADMIN_URL_ADMIN_PROD, // if you want admin as primary
  "ADMIN_QA":   process.env.ADMIN_URL_ADMIN_QA,
};
const BASE_URL = baseUrlMap[ENV] || fallback[ENV];
if (!BASE_URL) throw new Error(`BASE_URL not set for ${ENV} in .env`);
console.log('-----------------' + ENV + '-----------------');
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export { ENV, BASE_URL };
export default defineConfig({
  globalSetup: './utils/global-setup.js',
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 0,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : Math.min(os.cpus().length - 1, 5),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
     extraHTTPHeaders: {
      'X-Test-Env': ENV, // optional: handy in debugging
    },
    env: ENV,           // 👈 expose ENV
    baseURL: BASE_URL,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    video:'on',
    trace: 'retain-on-failure',
    geolocation: { latitude: 23.8103, longitude: 90.4125 },
    permissions: ['geolocation'],
    viewport: null,
    launchOptions: {
      args: [
        '--enable-geolocation',
        '--start-maximized',
        '--force-device-scale-factor=1',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--allow-running-insecure-content',
        '--disable-site-isolation-trials',
        '--ignore-certificate-errors',
      ],
    },
    // storageState: './LoginAuth_default.json', 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Browser:Google Chrome",
      // use: { ...devices["Desktop Chrome"], 
        use: { 
        baseURL: BASE_URL,
    }},
    // },
    
    /*{
      name: 'Browser:Firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'Browser: Webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Browser: Microsoft Edge',
    //   use: { channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { channel: 'chrome' },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
});

