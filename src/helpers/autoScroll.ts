import { Page } from 'puppeteer';

export async function autoScroll(page: Page){
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= window.innerHeight * 10) {
          clearInterval(timer);
          resolve({});
        }
      }, 100);
    });
  });
}