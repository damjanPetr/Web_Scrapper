import { Page } from "puppeteer";
import { State } from "./State";
// import StealthPluggin from "puppeteer-extra-plugin-stealth";
// import puppeteer from "puppeteer-extra";
import puppeteer from "puppeteer";
import { mapActions } from "../types";

// puppeteer.use(StealthPluggin());

export abstract class Action {
  protected uuid: number = Math.floor(Math.random() * 10000);
  protected name: string;
  abstract execute(): any | Promise<any>;
  protected invoker: Invoker;
  protected state: State;

  constructor() {
    const className = this.constructor.name;
    this.name = className;
    this.invoker = test;

    this.state = this.invoker.getState();
  }

  toString() {
    return `${this.name} + UUID   ${this.uuid}`;
  }
}

class loadBrowserAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    this.state.browser = await puppeteer.launch({
      headless: false,
    });
    console.log("🚀 ✔ loadBrowserAction ✔ execute ✔ browser:", this.state);
  }
}
class openNewPageAction extends Action {
  public url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  async execute() {
    if (this.state.browser) {
      const page = await this.state.browser.newPage();
      await page.goto(this.url);
      this.state.page = page;
    }
  }
}
class closeBrowserAction extends Action {
  constructor() {
    super();
  }
  execute(): void {
    if (this.state.browser) this.state.browser?.close();
  }
}

class waitForPageNavigationAction extends Action {
  private page: Page;
  constructor(page: Page) {
    super();
    this.page = page;
  }
  async execute() {
    this.page.waitForNavigation();
  }
}

class waitForSelectorElements extends Action {
  private selector: string;

  constructor(selector: string) {
    super();
    this.selector = selector;
  }
  async execute() {
    if (this.state.page) {
      const element = await this.state.page.waitForSelector(this.selector);
      await element?.evaluate((e: any) => {
        this.state.elements?.push(e);
      });
    }
  }
}
class waitForSelector extends Action {
  private selector: string;

  constructor(selector: string) {
    super();
    this.selector = selector;
  }
  async execute() {
    if (this.state.page) {
      const element = await this.state.page.waitForSelector(this.selector);
      await element?.evaluate((e) => {
        this.state.elements?.push(e);
      });
    }
  }
}

class Invoker {
  private onStart: Action | null = null;
  private onEnd: Action | null = null;
  private actions: { action: mapActions; parameters: string }[] = [];
  protected state: State;

  private hashmap: {
    [K in mapActions]: new (...arg: any) => Action;
  } = {
    loadBrowser: loadBrowserAction,
    closeBrowser: closeBrowserAction,
    waitPageNavigation: waitForPageNavigationAction,
    waitSelector: waitForSelector,
  };

  constructor() {
    this.state = new State();
  }

  setOnStart(action: Action) {
    this.onStart = action;
  }
  setOnEnd(action: Action) {
    this.onEnd = action;
  }
  addAction(action: mapActions, params: string) {
    this.actions.push({
      action: action,
      parameters: params,
    });
  }
  async activate() {
    await this.onStart?.execute();
    for (const { action, parameters } of this.actions) {
      console.log(action, parameters);
      try {
        const actionClass = await new this.hashmap[action](...parameters);
        actionClass.execute();
      } catch (err) {
        console.log(err);
      }
    }
    await this.onEnd?.execute();
  }
  listActions() {
    for (const action of this.actions) {
      return action.toString();
    }
    if (this.actions.length >= 0) {
      return "there are currently no actions loaded";
    }
  }
  setState(state: State) {}
  getState() {
    return this.state;
  }
}

class getElementText extends Action {
  constructor() {
    super();
  }
  async execute() {
    if (this.state.elements && this.state.elements.length > 0) {
      const element = this.state.elements[0];
      const text = element.textContent;
      console.log(text);
    }
  }
}
const test = new Invoker();

test.setOnStart(new loadBrowserAction());
test.setOnEnd(new closeBrowserAction());
test.addAction("waitPageNavigation", '["https://www.google.com"]');
test.addAction(
  "waitSelector",
  `"#gb > div > div:nth-child(1) > div > div:nth-child(1) > a"`
);
test.activate();
console.log(test.listActions());
