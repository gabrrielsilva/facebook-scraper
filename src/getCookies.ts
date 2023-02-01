import { Page } from 'puppeteer';

export async function getCookies(page: Page) {
  const cookies = await page.cookies('https://facebook.com');
  return cookies;
}