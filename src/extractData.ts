import { Page } from 'puppeteer';
import { delay } from './utils/delay';

export async function extractData(page: Page, keywords: string[], existingData: { id: string }[]) {
  const links = await page.$$('a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm');
  
  for await (const link of links) {
    try {
      await link.evaluate(e => e.scrollIntoView({ block: "center", inline: "center" }));
      await link.hover();
      await delay(2000);
    } catch {
      console.error();
    }
  } // need to hover on the date time to load href

  const data = await page.evaluate(async (keywords, existingData) => {    
    const ads: { description: string, linkToAd: string, timestamp: string }[] = [];

    const adsData = <NodeListOf<HTMLDivElement>>document.querySelectorAll('div [class = "x11i5rnm xat24cr x1mh8g0r x1vvkbs xdj266r x126k92a"]');
    const linksData = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll('a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm');
    for (let i = 0; i < adsData.length; i++) {
      const description = adsData[i].innerText;
      for await (const keyword of keywords) {
        const formattedKeyword = keyword.toLowerCase().replace(/ /g, '').replace(/[^a-z0-9]/gi, '');
        const formattedDescription = description.toLowerCase().replace(/ /g, '').replace(/[^a-z0-9]/gi, '');
        const linkToAd = linksData[i].href;
        
        if (!existingData.find(data => data.id === formattedDescription) && formattedDescription.includes(formattedKeyword)) {          
          ads.push({ description, linkToAd: <string>linkToAd, timestamp: linksData[i].innerText });
        }
      }
    }
  
    return ads;
  }, keywords, existingData);

  return data;
}