import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
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

const GROUPS = [
  process.env.FACEBOOK_GROUP_URL_1,
  process.env.FACEBOOK_GROUP_URL_1,
  process.env.FACEBOOK_GROUP_URL_2,
  process.env.FACEBOOK_GROUP_URL_3,
  process.env.FACEBOOK_GROUP_URL_1,
  process.env.FACEBOOK_GROUP_URL_2,
  process.env.FACEBOOK_GROUP_URL_3,
  process.env.FACEBOOK_GROUP_URL_1,
  process.env.FACEBOOK_GROUP_URL_2,
]

const client = new Client({});

client.on('qr', qr => qrCode.generate(qr, { small: true }));
client.on('ready', async () => {
  run(['shape'])
  await import('./checkIncomingMessageChatId')
});
client.initialize();

let groupIndex = 0;

export async function run (keywords: string[]) {  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();

  async function makeScraping(keywords: string[]) {
    await overridePermissions(context);
    await verifyAuthentication(page);
    await delay(3000);
    await goToFacebookGroup(page, <string>GROUPS[groupIndex]);
    await autoScroll(page);
    const existingData = await getExistingData();
    const data = await extractData(page, keywords, existingData);
    if (!data) {
      await delay(1000 * 60 * 1); //1 min
      makeScraping(keywords);
    }
    await registerAds(data);

    for await (const ad of data) {
      client.sendMessage(<string>process.env.CHAT_ID, `*Descrição:* ${ad.description}\n\n*Anúncio:* ${ad.linkToAd}`);
    }
    
    groupIndex++;
    if (groupIndex === GROUPS.length - 1) groupIndex = 0;
    await delay(1000 * 60 * 1); //1 min
    makeScraping(keywords);
  }

  makeScraping(keywords);
}

export { client };

