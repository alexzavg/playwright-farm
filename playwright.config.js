const { defineConfig, devices } = require('@playwright/test');

const DEVICE = process.env.DEVICE || 'chrome';

const projectMap = {
  chrome: { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
  android: { name: 'android', use: { ...devices['Pixel 5'] } },
  'android-landscape': { name: 'android-landscape', use: { ...devices['Pixel 5 landscape'] } },
  iphone: { name: 'iphone', use: { ...devices['iPhone 13'] } },
  'iphone-landscape': { name: 'iphone-landscape', use: { ...devices['iPhone 13 landscape'] } },
};

const selectedProject = projectMap[DEVICE] || projectMap.chrome;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  fullyParallel: true,
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 5,
  
  use: {
    baseURL: 'https://www.demoblaze.com',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  projects: [selectedProject],

  reporter: [
    ['./reporters/funnel-reporter.js'],
    ['list']
  ],

  outputDir: './test-results',
});
