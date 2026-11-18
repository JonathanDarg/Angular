import { expect, test } from '@playwright/test';

// END-TO-END TESTS: Playwright opens the real app in a real browser
// and uses it the way a person would.
//
// Each test gets a fresh `page` (a new browser tab), so tests don't affect each other.
// Locators like getByRole / getByLabel find elements by what users see and
// what screen readers announce, which also checks the page is accessible.

// Runs before every test in this file: open the home page.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows the page title', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('08 · Testing');
  // The browser tab title comes from src/index.html.
  await expect(page).toHaveTitle(/08Testing/);
});

test('formats a runtime as the user types', async ({ page }) => {
  const minutes = page.getByLabel('Minutes');
  const output = page.getByTestId('runtime-output');

  await expect(output).toHaveText('2h 22m'); // starting value: 142

  // fill() clears the input and types the new value.
  await minutes.fill('45');
  await expect(output).toHaveText('45m');

  await minutes.fill('-5');
  await expect(output).toContainText('Error');
});

test('adds to the watchlist and ignores duplicates', async ({ page }) => {
  const input = page.getByLabel('Add to watchlist');
  const count = page.getByTestId('watchlist-count');

  await input.fill('Inception');
  await input.press('Enter');
  await input.fill('Inception');
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(count).toHaveText('1 in watchlist');
  // Look only inside the watchlist: "Inception" also appears in the search results list.
  const watchlist = page.getByRole('list', { name: 'Watchlist' });
  await expect(watchlist.getByRole('listitem')).toHaveCount(1);
  await expect(watchlist.getByRole('listitem')).toContainText('Inception');

  await page.getByRole('button', { name: 'Remove Inception' }).click();
  await expect(count).toHaveText('0 in watchlist');
});

test('rating a movie updates the message', async ({ page }) => {
  await page.getByRole('button', { name: 'Rate 4 out of 5' }).click();

  await expect(page.getByTestId('rating-message')).toHaveText('You rated it 4 out of 5.');
  await expect(page.getByRole('button', { name: 'Rate 4 out of 5' })).toHaveAttribute('aria-pressed', 'true');
});

test('search filters the movie list after typing pauses', async ({ page }) => {
  const results = page.getByTestId('search-results').getByRole('listitem');
  await expect(results).toHaveCount(10);

  // pressSequentially types one key at a time, like a real person.
  await page.getByLabel('Search movies').pressSequentially('the', { delay: 50 });

  // toHaveCount keeps retrying until it passes (or times out), so it
  // naturally waits out the 300 ms debounce. No manual sleep needed.
  // 5 titles contain "the": Shawshank, Godfather, Dark Knight, Matrix, Back to the Future.
  await expect(results).toHaveCount(5);
  await expect(results.first()).toHaveText('The Shawshank Redemption');
});
