# Testing Framework

This project uses a layered test structure so the team can start documenting BDPA Elections IRV requirements before every route, page, or helper exists. The placeholder coverage includes the original Part 1 requirements plus the Part 2 changes such as election audit logs, descriptive IRV results, reporter assignment limits, open registration, human-friendly timestamps, and vote-change limits.

## Directory Structure

```txt
tests/
  unit/
    auth/
    elections/
    security/
    ui/
  integration/
    api/
    app/
  e2e/
```

`tests/unit` is for fast tests around business rules and pure helper functions. These should not need the Express server, a browser, or the remote API. Good examples are role validation, password strength, login lockout timing, election status, sorting, pagination, and IRV winner calculation.

`tests/integration/api` is for tests that call the external BDPA API. Keep these few and focused because they need `API_BASE_URL`, `BEARER_TOKEN`, network access, and stable remote data.

`tests/integration/app` is for Express route tests using the local app from `app.js`. These tests should use Supertest to verify redirects, response status codes, rendered pages, request validation, and graceful error handling.

`tests/e2e` is for Playwright browser tests. These should cover user journeys once pages exist: login, dashboard behavior, voting, history pagination, real-time updates, performance smoke checks, and responsive layouts.

Part 2 requirements are represented in the same layers:

- Unit tests cover rule-level behavior such as audit-log entries, descriptive IRV summaries, login history, pending registration, human-friendly time formatting, and the five-minute vote-change window.
- App integration tests cover route behavior such as signup, pending-user blocking, reporter election assignment, audit-log access, profile editing, and administrator-only voter-name visibility.
- E2E tests cover visible user workflows such as displaying an election audit log, seeing expiration warnings, editing profile information, and viewing richer election results.

## File Naming

Use `.test.js` for Jest-owned tests:

```txt
tests/unit/auth/password-strength.test.js
tests/integration/app/auth-routes.test.js
tests/integration/api/info.test.js
```

Use `.spec.js` for Playwright-owned end-to-end browser tests:

```txt
tests/e2e/auth.spec.js
tests/e2e/dashboard.spec.js
tests/e2e/election.spec.js
```

This naming split is intentional. Jest is configured in `jest.config.js` to run `tests/**/*.test.js` and ignore `tests/e2e`. Playwright commonly uses `.spec.js` for browser tests, so the file extension gives a quick visual clue about which test runner owns the file.

## Package Roles

### Jest

Jest is the main JavaScript test runner. It finds files matching `tests/**/*.test.js`, runs assertions, and reports pass/fail/skip status.

Use Jest for:

- Unit tests.
- Express integration tests.
- API integration tests.
- Requirement placeholders with `describe.skip`.

Example:

```js
describe('password strength', () => {
  test('classifies short passwords as weak', () => {
    expect(getPasswordStrength('short')).toBe('weak');
  });
});
```

### Supertest

Supertest lets tests make requests against the Express app without starting a real HTTP server. It is best for route-level behavior.

Use Supertest for:

- Confirming unauthenticated users are blocked.
- Testing redirects to login.
- Checking response status codes.
- Submitting forms or JSON payloads to app routes.
- Verifying app-owned error pages appear instead of raw crashes.

Example:

```js
const request = require('supertest');
const app = require('../../../app');

describe('GET /dashboard', () => {
  test('redirects unauthenticated users to login', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
});
```

### Playwright

Playwright opens the app in a real browser. It is best for behavior that depends on rendered pages, client-side JavaScript, responsive layout, or user interaction.

Use Playwright for:

- Login and logout flows.
- Dashboard flows for each role.
- Casting or changing a vote.
- Verifying history pagination and sorting in the UI.
- Checking mobile, tablet, and desktop viewports.
- Testing real-time or polling updates without a page refresh.

Example:

```js
const { test, expect } = require('@playwright/test');

test('login page renders', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});
```

## Placeholder Tests

Many files currently use skipped suites because the requirement is known, but the app code or page does not exist yet.

Use `describe.skip` in Jest when a requirement is known but no implementation exists yet:

```js
describe.skip('Requirement 5: history routes', () => {
  test('allows reporters to view closed election history and nothing else', () => {});
});
```

This keeps unfinished requirements visible without listing them as passing tests. When the functionality is built, remove `.skip` and fill in the assertions.

Use `test.skip` in Playwright when the page or workflow is not ready yet:

```js
test.skip('users can log in and land on their dashboard', async () => {});
```

These placeholders keep the requirement visible without making the build fail too early or making unfinished functionality look complete.

## Filling In A Unit Test

When a helper is implemented, remove `.skip` from the suite and replace the empty test body with real assertions.

Before:

```js
describe.skip('Requirement 6: password strength', () => {
  test('classifies passwords of 10 characters or fewer as weak', () => {});
});
```

After:

```js
const { getPasswordStrength } = require('../../../src/auth/passwords');

describe('Requirement 6: password strength', () => {
  test('classifies passwords of 10 characters or fewer as weak', () => {
    expect(getPasswordStrength('1234567890')).toBe('weak');
  });
});
```

## Filling In A Route Test

Once a route exists, use Supertest to test the server behavior directly.

```js
const request = require('supertest');
const app = require('../../../app');

test('history redirects unauthenticated users to login', async () => {
  const response = await request(app).get('/history');

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe('/login');
});
```

If the route needs an authenticated user, add a reusable test helper that creates a session or sets the same cookie the app uses after login.

## Filling In A Page Test

Once a page exists, convert a skipped Playwright test into a real user-flow test.

```js
const { test, expect } = require('@playwright/test');

test('users can page through closed election history', async ({ page }) => {
  await page.goto('/history');

  await expect(page.getByRole('heading', { name: /history/i })).toBeVisible();
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page).toHaveURL(/page=2/);
});
```

Prefer testing what the user can see and do instead of testing CSS classes or internal implementation details.

## Commands

Run all Jest tests:

```sh
npm test
```

Run only live API integration tests:

```sh
npm run test:api
```

Run Playwright browser tests:

```sh
npm run test:e2e
```

The Playwright config starts the app with `npm start` and uses `http://127.0.0.1:3000` as the base URL.
