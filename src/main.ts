import dotenv from 'dotenv';
import puppeteer, { Browser, BrowserContext, Page } from 'puppeteer';
import qrCode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
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
  <string>process.env.FACEBOOK_GROUP_URL_5,
]

const client = new Client({ puppeteer: { args: ['--no-sandbox','--disable-setuid-sandbox'], handleSIGINT: false }, authStrategy: new LocalAuth() });
client.on('qr', qr => qrCode.generate(qr, { small: true }));
client.on('ready', async () => {
  await import('./checkIncomingMessageChatId');
  run(['33% OFF', '34% OFF', '35% OFF', '36% OFF', '37% OFF', '38% OFF', '39% OFF', '40% OFF', '41% OFF', '42% OFF', '43% OFF', '44% OFF', '45% OFF', 'FADE', 'BUTTERFLY']);
});
client.initialize().catch(e => console.log(e));

let browser: Browser;
let page: Page;
let context: BrowserContext;

(async () => {
  console.log('Iniciar o browser');
  browser = await puppeteer.launch({ headless: "new",  args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  page = await browser.newPage();
  context = browser.defaultBrowserContext();
})()

export async function run (keywords: string[]) {
  console.log('Buscando por anúncios');
  await overridePermissions(context);
  await verifyAuthentication(page);
  await goToFacebookGroup(page, GROUPS[groupIndex]);
  await autoScroll(page);
  const existingData = await getExistingData();
  const data = await extractData(page, keywords, existingData, GROUPS[groupIndex]);
  if (!data) {
    await delay(1000 * 90); //90s
    run(keywords);
  };
  console.log(data);
  await registerAds(data);
  for await (const ad of data) {
    client.sendMessage(<string>process.env.CHAT_ID, `*Descrição:* ${ad.description}\n\n*Anúncio:* ${ad.linkToAd}\n\n*Vendedor:* ${ad.seller}`);
  }
  groupIndex++;
  if (groupIndex === GROUPS.length - 1) groupIndex = 0;
  await delay(1000 * 90); //90s
  run(keywords);
}

export { client };

