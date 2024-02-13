import { Browser, Page } from "puppeteer";
import { Action } from "./Action";

export class State {
  public page: Page | null = null;
  public action: Action | null = null;
  public browser: Browser | null = null;
  public elements: Element[] | null = null;
  constructor() {}
  getState() {
    return {
      page: this.page,
      action: this.action,
      browser: this.browser,
      elements: this.elements,
    };
  }
  setBrowser(browser: Browser) {
    this.browser = browser;
  }
}
