import puppeteer, { Page } from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage()
  await page.goto('https://www.facebook.com/groups/756215944466744/posts', { waitUntil: 'networkidle2' });
  await autoScroll(page);

  console.log('scrapping...')
  
  setTimeout(async () => {
    const data = await page.evaluate(() => {
      const ads: string[] = [];

      const adsData = document.querySelectorAll('div [class = "x11i5rnm xat24cr x1mh8g0r x1vvkbs xdj266r x126k92a"]');
      adsData.forEach((el) => {        
        ads.push((<HTMLElement>el).innerText as string);
      })
    
      return ads;
    })

    console.log(data);
    await browser.close();
  }, 4000)
})()

async function autoScroll(page: Page){
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= window.innerHeight * 50) {
          clearInterval(timer);
          resolve({});
        }
      }, 100);
    });
  });
}