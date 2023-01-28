import { Page } from 'puppeteer';

export async function extractData(page: Page, keywords: string[]) {
  const data = await page.evaluate(async (keywords) => {
    const ads: { description: string, linkToProfile: string }[] = [];

    const linkToProfile = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll('span > a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f');
    const adsData = <NodeListOf<HTMLElement>>document.querySelectorAll('div [class = "x11i5rnm xat24cr x1mh8g0r x1vvkbs xdj266r x126k92a"]');
    
    for (let i = 0; i < adsData.length; i++) {
      const description = adsData[i].innerText;
      const seller = `https://facebook.com/${linkToProfile[i].href.split('/')[6]}`
      
      for await (const keyword of keywords) {
        const formattedKeyword = keyword.toLowerCase();
        const formattedDescription = description.toLowerCase();

        if (formattedDescription.includes(formattedKeyword)) {
          ads.push({ description, linkToProfile: seller });
        }
      }
    }
  
    return ads;
  }, keywords);

  return data;
}