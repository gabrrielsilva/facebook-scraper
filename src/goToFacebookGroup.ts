import { Page } from 'puppeteer';

export async function goToFacebookGroup(page: Page, groupUrl: string) {
  await page.goto(groupUrl, { waitUntil: 'networkidle2' });
}