import puppeteer, { Browser, Page } from "puppeteer";

class ActionBuilder {
  private browser: Browser | undefined;
  constructor() {}

  async loadBrowser() {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }
  async openNewPage(url: string) {
    if (this.browser) {
      const page = await this.browser.newPage();
      page.goto(url);
      return page;
    }
  }
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
  async selectElement(page: Page, ...selectors: string[]) {
    const el = await page.waitForSelector(`${selectors}`);
    if (el) {
      return el;
    }
  }
  async waitForNavigation(page: Page) {
    await page.waitForNavigation();
  }
}

class Scrapper {
  constructor() {}
}
