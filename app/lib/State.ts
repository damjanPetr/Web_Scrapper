import { Browser, Page } from "puppeteer";
import { Action } from "./Action";

export class State {
  protected page: Page | null = null;
  protected action: Action | null = null;
  protected browser: Browser | null = null;
  protected element: Element[] | null = null;
  constructor(page: Page | null, action: Action | null) {
    this.page = page;
    this.action = action;
  }
  getState() {
    return {
      page: this.page,
      action: this.action,
      browser: this.browser,
      elements: this.element,
    };
  }
}
