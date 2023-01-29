import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import qrCode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { extractData } from './extractData';
import { goToFacebookGroup } from './goToFacebookGroup';
import { autoScroll } from './helpers/autoScroll';
import { loginInFacebook } from './loginInFacebook';
import { overridePermissions } from './overridePermissions';
import { delay } from './utils/delay';
dotenv.config();

const client = new Client({});

client.on('qr', qr => qrCode.generate(qr, { small: true }));
client.on('ready', async () => await import('./checkIncomingMessageChatId'));
client.initialize();

export async function run (keywords: string[]) {
  client.sendMessage(<string>process.env.CHAT_ID, '*Bot:* Isso pode demorar alguns minutos...');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  
  await overridePermissions(context);
  await loginInFacebook(page);
  await delay(4000);
  await goToFacebookGroup(page);
  await autoScroll(page);
  const data = await extractData(page, keywords);  
  
  for await (const ad of data) {
    client.sendMessage(<string>process.env.CHAT_ID, `*Bot:* ${ad.description}\n\n*Vendedor:* ${ad.linkToProfile}`);
  }
    
  await browser.close();
}

export { client };

