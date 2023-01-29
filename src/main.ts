import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import qrCode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { extractData } from './extractData';
import { getExistingData } from './getExistingData';
import { goToFacebookGroup } from './goToFacebookGroup';
import { autoScroll } from './helpers/autoScroll';
import { loginInFacebook } from './loginInFacebook';
import { overridePermissions } from './overridePermissions';
import { registerAds } from './registerAds';
import { delay } from './utils/delay';
dotenv.config();

const client = new Client({});

client.on('qr', qr => qrCode.generate(qr, { small: true }));
client.on('ready', async () => await import('./checkIncomingMessageChatId'));
client.initialize();

export async function run (keywords: string[]) {  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  
  await overridePermissions(context);
  await loginInFacebook(page);
  await delay(4000);
  await goToFacebookGroup(page);
  await autoScroll(page);
  const existingData = await getExistingData();
  const data = await extractData(page, keywords, existingData);
  
  for await (const ad of data) {
    client.sendMessage(<string>process.env.CHAT_ID, `*Bot:* ${ad.description}\n\n*Vendedor:* ${ad.linkToProfile}`);
  }
  
  await registerAds(data);
  await delay(1000);
  run(keywords);
  // await browser.close();
}

export { client };

