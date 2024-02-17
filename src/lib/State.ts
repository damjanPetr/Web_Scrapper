import { Browser, ElementHandle, Page } from "puppeteer";
import { toResult } from "./misc/helpers";

export class State {
  public page: Page | null = null;
  public info = {
    title: "",
    link: "",
  };

  public action: string | null = null;
  public browser: Browser | null = null;
  public elements: ElementHandle[] | null = null;
  public result: any[] = [];
  public extractParams:
    | {
        name: string;
        selector: string;
        type: Parameters<typeof toResult>[2];
      }[]
    | null = [];
  constructor() {}
  getState() {
    return {
      result: this.result,
      page: this.page,
      action: this.action,
      browser: this.browser,
      elements: this.elements,
    };
  }
}
