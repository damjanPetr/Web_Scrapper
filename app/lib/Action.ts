import puppeteer, { Browser, Page } from "puppeteer";

abstract class Action {
  protected browser: Browser | null = null;
  protected uuid: number = Math.floor(Math.random() * 10000);
  protected name: string;
  abstract execute(): any | Promise<any>;

  constructor() {
    const className = this.constructor.name;
    this.name = className;
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
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }
}
class openNewPageAction extends Action {
  public url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  async execute() {
    if (this.browser) {
      const page = await this.browser.newPage();
      await page.goto(this.url);
      return page;
    }
  }
}
class closeBrowserAction extends Action {
  constructor() {
    super();
  }
  execute(): void {
    if (this.browser) {
      this.browser.close();
    }
  }
}

class navigatePageAction extends Action {
  constructor() {
    super();
  }
  async execute() {}
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

class waitForSelector extends Action {
  private page: Page;
  private selectors: string;

  constructor(page: Page, selectors: string) {
    super();
    this.page = page;
    this.selectors = selectors;
  }
  async execute() {
    await this.page.waitForSelector(this.selectors);
  }
}

class Invoker {
  private onStart: Action | null = null;
  private onEnd: Action | null = null;
  public actions: Action[] = [];
  constructor() {}

  setOnStart(action: Action) {
    this.onStart = action;
  }
  setOnEnd(action: Action) {
    this.onEnd = action;
  }
  addAction(action: Action) {
    this.actions.push(action);
  }
  async activate() {
    if (this.onStart) {
      await this.onStart.execute();
    }
    for (const action of this.actions) {
      await action.execute();
    }
    if (this.onEnd) {
      await this.onEnd.execute();
    }
  }
  listActions() {
    for (const action of this.actions) {
      console.log(action.toString());
    }
  }
}
const test = new Invoker();
test.setOnStart(new loadBrowserAction());
test.setOnEnd(new closeBrowserAction());

const page = new openNewPageAction("https://www.google.com");
test.addAction(new waitForSelector(page, "#search"));
