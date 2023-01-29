import { BrowserContext } from 'puppeteer';

export async function overridePermissions(context: BrowserContext) {
  await context.overridePermissions('https://facebook.com', []);
  await context.overridePermissions(<string>process.env.FACEBOOK_GROUP_ID, []);
}