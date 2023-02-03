import dotenv from 'dotenv';
import puppeteer, { Browser, BrowserContext, Page } from 'puppeteer';
import qrCode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { extractData } from './extractData';
import { getExistingData } from './getExistingData';
import { goToFacebookGroup } from './goToFacebookGroup';
import { autoScroll } from './helpers/autoScroll';
import { overridePermissions } from './overridePermissions';
import { registerAds } from './registerAds';
import { delay } from './utils/delay';
import { verifyAuthentication } from './verifyAuthentication';
dotenv.config();

let groupIndex = 0;
const GROUPS = [
  <string>process.env.FACEBOOK_GROUP_URL_1,
  <string>process.env.FACEBOOK_GROUP_URL_2,
  <string>process.env.FACEBOOK_GROUP_URL_3,
  <string>process.env.FACEBOOK_GROUP_URL_4,
]

const client = new Client({ puppeteer: { args: ['--no-sandbox','--disable-setuid-sandbox'] }});
client.on('qr', qr => qrCode.generate(qr, { small: true }));
client.on('ready', async () => {await import('./checkIncomingMessageChatId'); run(['butter', '30', '34', '35', 'OFF', 'vendo']) });
client.initialize();

let browser: Browser;
let page: Page;
let context: BrowserContext;

(async () => {
  browser = await puppeteer.launch({ headless: true,  args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  page = await browser.newPage();
  context = browser.defaultBrowserContext();
})()

export async function run (keywords: string[]) {
  await overridePermissions(context);
  await verifyAuthentication(page);
  await goToFacebookGroup(page, GROUPS[groupIndex]);
  await autoScroll(page);
  const existingData = await getExistingData();
  const data = await extractData(page, keywords, existingData, GROUPS[groupIndex]);
  if (!data) {
    await delay(1000 * 30); //30s
    run(keywords);
  };
  await registerAds(data);
  for await (const ad of data) {
    client.sendMessage(<string>process.env.CHAT_ID, `*Descrição:* ${ad.description}\n\n*Anúncio:* ${ad.linkToAd}`);
  }
  groupIndex++;
  if (groupIndex === GROUPS.length - 1) groupIndex = 0;
  await delay(1000 * 30); //30s
  run(keywords);
}

export { client };

