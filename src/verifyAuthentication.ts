import { Page } from 'puppeteer';
import { getCookies } from './getCookies';
import { loginInFacebook } from './loginInFacebook';

export async function verifyAuthentication(page: Page) {
  const cookies = await getCookies(page);
  if (!cookies.find(cookie => cookie.name === 'presence')) {
    await loginInFacebook(page);
  }
}