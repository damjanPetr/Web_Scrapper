import { Page } from "puppeteer";
import { State } from "./State";
// import StealthPluggin from "puppeteer-extra-plugin-stealth";
// import puppeteer from "puppeteer-extra";
import puppeteer from "puppeteer";
import { Invoker } from "./Invoker";
import { openSync, writeFile, writeFileSync } from "fs";
import db from "../database/Database";
import { stringify } from "csv";

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
    this.state = this.invoker.state;
    this.state.action = this.name;
  }

  toString() {
    return `${this.name} + UUID   ${this.uuid}`;
  }
  addToDatabase(arg: any) {
    db.action;
  }
}
export class addTitleAction extends Action {
  public title: string;
  constructor(title: string) {
    super();
    this.title = title;
  }
  async execute() {
    this.state.info.title = this.title;
  }
}

export class loadBrowserAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    this.state.browser = await puppeteer.launch({
      headless: "new",
    });
  }
}
export class openNewPageAction extends Action {
  public url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  async execute() {
    if (this.state.browser) {
      const page = await this.state.browser.newPage();
      await page.goto(this.url, {
        waitUntil: "domcontentloaded",
      });
      this.state.page = page;
      this.state.info.title = this.url;
    }
  }
}

export class closeBrowserAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    if (this.state.browser) this.state.browser?.close();
  }
}

export class waitForPageNavigationAction extends Action {
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

export class page$ extends Action {
  private selector: string;

  constructor(selector: string, filter: string) {
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
export class page$$ extends Action {
  private selector: string;

  constructor(selector: string, filter: string) {
    super();
    this.selector = selector;
  }
  async execute() {
    if (this.state.page) {
      const elements = await this.state.page.$$(this.selector);
      this.state.elements = elements;
      debugger;
    }
  }
}
export class waitForSelector extends Action {
  private selector: string;

  constructor(selector: string) {
    super();
    this.selector = selector;
  }
  async execute() {
    if (this.state.page) {
      const element = await this.state.page.waitForSelector(this.selector);
      if (element) this.state.elements?.push(element);
    }
  }
}

export class typeAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    if (this.state.elements && this.state.elements.length > 0) {
      this.state.elements.forEach((element) => {
        element.type("test");
      });
    }
  }
}
export class addExtractTypeAction extends Action {
  constructor(
    public selector: string = "",
    public name: string,
    public type: "textContent" | "href"
  ) {
    super();
  }

  async execute() {
    if (this.state) {
      this.state.extractParams?.push({
        name: this.name,
        selector: this.selector,
        type: this.type,
      });
    }
  }
}

export class evaluateElements extends Action {
  constructor() {
    super();
  }
  async execute() {
    const document: { [key: string]: string } = {};
    const page = this.state.page;
    const elementArray = this.state.elements;
    const params = this.state.extractParams;

    if (elementArray)
      for (let element of elementArray) {
        if (params) {
          const temp: { [key: string]: string } = {};
          await new Promise((resolve, reject) => {
            params.forEach(async ({ name, selector, type }) => {
              // console.count("paramsCounts");
              const value = await page?.evaluate(
                (innerElement: any, type, selector) => {
                  if (selector === "") {
                    console.log(innerElement[type]);
                    return innerElement[type];
                  } else {
                    const ele = innerElement.querySelector(selector);
                    return ele[type];
                  }
                },
                element,
                type,
                selector
              );
              // console.log(name, "::::", value);
              temp[name] = value;
              resolve(value);
            });
          });

          this.state.result.push(temp);
        }
      }
  }
}

export class writeToCsv extends Action {
  constructor() {
    super();
  }
  execute() {
    // writeFileSync("./result.csv", JSON.stringify(this.state.result) + "\r", {
    //   flag: "a",
    // });

    // const data = this.state.result.map((obj) => {});
    console.log(this.state.result);
  }
}

type AllHTMLElementProperties = {
  [K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K];
};
export class printResultAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    console.log(this.state.result);
    const info = {
      title: this.state.info.title,
      link: this.state.info.link,
    };

    stringify(
      this.state.result,
      { header: true, columns: ["title", "link"] },
      (err, csv) => {
        if (err) throw err;

        writeFileSync("./result.csv", info + "\r", { flag: "a" });
        writeFileSync("./result.csv", csv + "\r", { flag: "a" });
      }
    );
  }
}
const test = new Invoker();

test.setOnStart(new loadBrowserAction());
test.setOnEnd(new closeBrowserAction());

test.addAction("addTitle", "string");

test.addAction(
  "openNewPage",
  "https://haberdashpi.github.io/vscode-selection-utilities/stable/edit_text.html"
);
// test.addAction("addExtractType", "", "class", "className");
test.addAction("addExtractType", "", "link", "href");
test.addAction("page$$", "a");
test.addAction("evaluateElements");
test.addAction("printResult");
test.activate();

export function toResult(
  element: any,
  innerSelector: string,
  extractType: "textContent" | "href"
) {
  const e = element.querySelector(`${innerSelector}`);
  if (e) {
    return e[extractType];
  }
}

interface addToDatabase {
  name: string;
  url: string;
}
