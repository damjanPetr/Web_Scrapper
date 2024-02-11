import puppeteer, { Page } from "puppeteer";
import { State } from "./State";

export abstract class Action {
  protected uuid: number = Math.floor(Math.random() * 10000);
  protected name: string;
  abstract execute(): any | Promise<any>;
  protected invoker: Invoker;
  protected state: ReturnType<Invoker["getState"]>;

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
    if (this.state.browser) {
      this.state.browser.close();
    }
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
  private actions: Action[] = [];
  protected state: State;

  constructor() {
    this.state = new State(null, null);
  }

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
      console.log(this.onStart?.toString());
      console.log(action.toString());
      console.log(this.onEnd?.toString());
    }
  }
  setState(state: State) {
    this.state = state;
  }
  getState() {
    return this.state.getState();
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

const hashmap: { [key: string]: Action } = {};

test.setOnStart(new loadBrowserAction());
test.setOnEnd(new closeBrowserAction());

test.addAction(new openNewPageAction("http://google.com"));
test.addAction(new waitForSelector("p"));
test.addAction(new getElementText());
// test.activate();
console.log(test.listActions());
