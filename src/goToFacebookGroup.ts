import { Page } from 'puppeteer';

export async function goToFacebookGroup(page: Page) {
  await page.goto(<string>process.env.FACEBOOK_GROUP_URL, { waitUntil: 'networkidle2' });
}