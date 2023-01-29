import { Page } from 'puppeteer';

export async function extractData(page: Page, keywords: string[], existingData: { description: string }[]) {
  const data = await page.evaluate(async (keywords, existingData) => {    
    const ads: { description: string, linkToProfile: string }[] = [];

    const linkToProfile = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll('span > a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f');
    const adsData = <NodeListOf<HTMLElement>>document.querySelectorAll('div [class = "x11i5rnm xat24cr x1mh8g0r x1vvkbs xdj266r x126k92a"]');
    const postId = <NodeListOf<HTMLElement>>document.querySelectorAll('div.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz');

    for (let i = 0; i < adsData.length; i++) {
      const description = adsData[i].innerText;
      const seller = `https://facebook.com/${linkToProfile[i].href.split('/')[6]}`;
      
      for await (const keyword of keywords) {
        const formattedKeyword = keyword.toLowerCase();
        const formattedDescription = description.toLowerCase();

        if (!existingData.find(data => data.description === description) && formattedDescription.includes(formattedKeyword)) {
          ads.push({ description, linkToProfile: seller });
        }
      }
    }
  
    return ads;
  }, keywords, existingData);

  return data;
}