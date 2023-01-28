import { Page } from 'puppeteer';

export async function loginInFacebook(page: Page) {
  const email = <string>process.env.FACEBOOK_EMAIL;
  const password = <string>process.env.FACEBOOK_PASSWORD;

  await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });
  await page.evaluate((email, password) => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('pass') as HTMLInputElement;
    emailInput.value = email;
    passwordInput.value = password;
    const loginButton = document.getElementById('loginbutton') as HTMLButtonElement;
    loginButton.click();
  }, email, password)
}