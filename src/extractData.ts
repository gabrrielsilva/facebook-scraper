import { Page } from 'puppeteer';
import { delay } from './utils/delay';

export async function extractData(page: Page, keywords: string[], existingData: { id: string }[], groupUrl: string) {
  const links = await page.$$('a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm');
  for await (const link of links) {
    try {
      await link.evaluate(e => e.scrollIntoView({ block: 'center', inline: 'center' }));
      await link.hover();
      await delay(3000);
    } catch {
      console.error();
    }
  } // need to hover on the date time to load href

  const data = await page.evaluate(async (keywords, existingData, groupUrl) => {    
    const ads: { description: string, linkToAd: string }[] = [];
    const posts = Array.from<HTMLElement>(document.querySelectorAll('div.x9f619.x1n2onr6.x1ja2u2z.x2bj2ny.x1qpq9i9.xdney7k.xu5ydu1.xt3gfkd.xh8yej3.x6ikm8r.x10wlt62.xquyuld')); // init 2
    posts.splice(0, 2);

    for await (const post of posts) {
      const description = post.querySelector('div.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.xdj266r') as HTMLDivElement;
      const adLink = post.querySelector('a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm') as HTMLAnchorElement;
      const photoLink = post.querySelector('a.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1q0g3np.x87ps6o.x1lku1pv.x1rg5ohu.x1a2a7pz.x1ey2m1c.xds687c.x10l6tqk.x17qophe.x13vifvy.x1pdlv7q') as HTMLAnchorElement;

      for await (const keyword of keywords) {
        const formattedDescription = description?.innerText.toLowerCase().replace(/ /g, '').replace(/[^a-z0-9]/gi, ''); // to compare data
        const linkToAd = adLink?.href.split('?')[0];
        const linkToAd2 = photoLink?.href;
        
        if (
          !existingData.find(data => data.id === formattedDescription) 
          && description?.innerText?.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))
          && !ads.find(ad => ad.description === description?.innerText)
        ) {          
          ads.push({ description: description?.innerText || 'Sem descrição', linkToAd: (<string>linkToAd === groupUrl.split('?')[0] ? linkToAd2 : linkToAd) || groupUrl });
        }
      }
    }
    return ads;
  }, keywords, existingData, groupUrl);

  return data;
}