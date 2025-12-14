const { defineConfig } = require('@playwright/test');

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

  reporter: [
    ['./reporters/funnel-reporter.js'],
    ['list']
  ],

  outputDir: './test-results',
});
