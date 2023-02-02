import { Page } from 'puppeteer';
import { delay } from './utils/delay';

export async function goToFacebookGroup(page: Page, groupUrl: string) {
  await page.goto(groupUrl, { waitUntil: 'networkidle2' });
  await delay(5000);
}