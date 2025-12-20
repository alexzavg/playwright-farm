# Playwright Load Test Farm

Load testing e-commerce funnels with Playwright, Page Object Model and a custom Windows XP-style dashboard.

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Commands](#-commands)
- [Custom Load](#-custom-load)
- [Dashboard](#-dashboard-windows-xp-style)
- [Project Structure](#-project-structure)
- [Architecture](#️-architecture)
- [Test Scenario](#-test-scenario)
- [Technologies](#️-technologies)
- [CI/CD](#-cicd)

## 🚀 Quick Start

```bash
# Installation
npm install
npx playwright install chromium

# Run tests (100 runs) + auto-open dashboard
npm run test:demoblaze:all

# Or just open dashboard (if tests were already run)
npm run dashboard
```

## 📋 Commands

| Command | Workers | Repeats | Description |
|---------|---------|---------|-------------|
| `npm run test:demoblaze:all` | 10 | 100 | Standard Chrome run with higher iterations |
| `npm run test:chrome-heavy` | 20 | 160 | Heavy load |
| `npm run test:android` | 10 | 50 | Android emulation |
| `npm run test:android-landscape` | 10 | 50 | Android landscape |
| `npm run test:iphone` | 10 | 50 | iPhone emulation |
| `npm run test:iphone-landscape` | 10 | 50 | iPhone landscape |
| `npm run dashboard` | - | - | Open dashboard |
| `npm run clean` | - | - | Clean reports |

## 🎯 Custom Load

```bash
# Custom parameters
npx playwright test demoblaze --workers=30 --repeat-each=100

# Specific device
DEVICE=android npx playwright test demoblaze --workers=5
```

## 📊 Dashboard (Windows XP style)

After tests, the dashboard opens automatically:

- **Statistics**: Total / Passed / Failed / Success Rate
- **Failure Hierarchy**: Spec → Step → Error → Traces
- **Trace Viewer**: 
  - Local — opens native Playwright trace viewer
  - On server (S3) — opens trace.playwright.dev

## 📁 Project Structure

```
playwright-farm/
├── support/                   # Page Objects, Selectors, Fixtures
│   ├── fixtures.js            # Shared fixtures for all projects
│   ├── pages/
│   │   └── demoblaze/         # Page Objects per project
│   └── selectors/
│       └── demoblaze/         # Selectors per project
├── tests/
│   └── demoblaze/             # Specs per project
│       └── checkout.spec.js
├── reporters/
│   └── funnel-reporter.js
├── scripts/
│   ├── clean.js
│   └── serve-dashboard.js
└── playwright.config.js
```

## 🏗️ Architecture

### Usage in spec

```javascript
const { test } = require('../../support/fixtures');

test('Sales funnel', async ({ demoblaze }) => {
  await test.step('Navigate to homepage', async () => {
    await demoblaze.homePage.navigate();
  });
  await test.step('Wait for products', async () => {
    await demoblaze.homePage.waitForProducts();
  });
});
```

### Adding a new project

1. `support/pages/newproject/` — page objects
2. `support/selectors/newproject/` — selectors
3. Add fixture to `support/fixtures.js`
4. `tests/newproject/` — specs

## 🔬 Test Scenario

Using [demoblaze.com](https://www.demoblaze.com) as an example, an e-commerce funnel is implemented:

**Home → Product → Cart → Checkout → Confirmation**

Each action is wrapped in an atomic `test.step()` for precise failure diagnostics. The repository is easily extensible — add your own page objects and specs following the same pattern.

## 🛠️ Technologies

- **Playwright** — browser automation
- **Page Object Model** — test architecture
- **Custom Reporter** — result collection and grouping
- **Node.js HTTP Server** — dependency-free dashboard
- **Trace Viewer** — debugging integration

## 🚢 CI/CD

### Docker

Official Playwright image with pre-installed browsers:

```bash
# Build
docker build -t playwright-farm .

# Run tests
docker run --rm playwright-farm npx playwright test tests/demoblaze/checkout.spec.js --workers=5
```

### GitHub Actions

Workflow runs via `workflow_dispatch` with configurable parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `branch` | master | Branch to run tests from |
| `specs` | tests/demoblaze/checkout.spec.js | Spec file(s) to run |
| `workers` | 10 | Parallel workers |
| `repeat_each` | 50 | Iterations per test |

**Run**: Actions → Playwright Load Tests → Run workflow

Results auto-deploy to GitHub Pages: `https://<user>.github.io/playwright-farm/`
