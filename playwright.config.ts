import { defineConfig, devices } from '@playwright/test';

const browserProjects = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Em CI usamos logs de terminal; o relatório HTML não é publicado.
  reporter: process.env.CI ? 'list' : 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        trace: 'off',
      },
    },

    ...browserProjects.map(({ name, device }) => ({
      name: `mock-${name}`,
      grepInvert: /@authenticated/,
      use: { ...device },
    })),

    ...browserProjects.map(({ name, device }) => ({
      name: `auth-${name}`,
      grep: /@authenticated/,
      dependencies: ['setup'],
      use: { ...device, trace: 'off' as const },
    })),
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
