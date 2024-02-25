import { Page } from "puppeteer";
import { State } from "./State";
// import StealthPluggin from "puppeteer-extra-plugin-stealth";
// import puppeteer from "puppeteer-extra";
import { stringify } from "csv";
import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import db from "../database/Database";
import { Invoker } from "./Invoker";

// puppeteer.use(StealthPluggin());

export abstract class Action {
  protected uuid: number = Math.floor(Math.random() * 10000);
  protected name: string;
  protected invoker: Invoker | null = null;
  protected state!: State;

  constructor() {
    this.name = this.constructor.name;
    this.invoker = null;
  }

  abstract execute(): any | Promise<any>;

  toString() {
    return `${this.name} + UUID   ${this.uuid}`;
  }

  setInvoker(invoker: Invoker) {
    this.invoker = invoker;
    this.state = invoker.state;
    this.state.action = this.name;
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
      headless: false,
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
    if (this.state.browser?.connected) {
      const page = await this.state.browser.newPage();
      await page.goto(this.url);
      this.state.page = page;
      this.state.info.link = this.url;
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
  private selectorType: string;
  private selector: string;
  private selectorName: string;

  constructor(selector: string, selectorType: string, selectorName: string) {
    super();
    this.selectorType = selectorType;
    console.log(this.selectorType);
    this.selector = selector;
    this.selectorName = selectorName;
  }
  async execute() {
    if (this.state.page) {
      const elements = await this.state.page.$$(this.selector);
      this.state.info.selectorName = this.selectorName;
      this.state.info.selectorType = this.selectorType;
      this.state.elements = elements;
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
    public type: "textContent" | "href",
    public filter: string = "",
  ) {
    super();
    console.log("test", selector, name, type);
    // this.selector = selector;
    // this.name = name;
    // this.type = type;
  }

  async execute() {
    if (this.state) {
      this.state.extractParams?.push({
        name: this.name,
        selector: this.selector,
        type: this.type,
        filter: this.filter,
      });
    }
  }
}

export class evaluateElements extends Action {
  constructor() {
    super();
  }
  async execute() {
    /**
     * subElementSelectors is an array of objects for extracting sub elements in
     * a defined object with name, selector and type
     */
    const page = this.state.page;
    const stateElements = this.state.elements;

    const elementParameters = this.state.extractParams;

    console.log(
      "🚀 ✔ evaluateElements ✔ execute ✔ subElementSelectors:",
      elementParameters,
    );

    if (stateElements) {
      //* Loop through dom elements from the state
      for (let element of stateElements) {
        if (elementParameters && elementParameters?.length > 0) {
          const elementResultObj: { [key: string]: string } = {};

          let filterTemp = 0;
          await new Promise((resolve, reject) => {
            //* Loop through array of objects with from parameters

            async function handleElement({
              name,
              selector,
              type,
              filter,
            }: NonNullable<typeof elementParameters>[number]) {
              const value = await page?.evaluate(
                (innerElement: any, type, selector, filter) => {
                  if (selector === "") {
                    // * if selector is empty, return the type data form the original element
                    if (innerElement[type] != null) return innerElement[type];
                    else return null;
                  } else {
                    // * if selector is not empty return the type data targeted by the selector
                    const ele = innerElement.querySelector(selector);
                    console.log(ele);
                    if (ele == null) return null;
                    if (filter !== "") {
                      console.log(ele[type], filter, type);
                      if (
                        (ele[type] as string)
                          .toLowerCase()
                          .includes(filter.toLowerCase())
                      ) {
                        console.log("%c 'filter", "background: pink", true);
                        return ele[type];
                      } else {
                        return null;
                      }
                    }

                    return ele[type];
                  }
                },
                element,
                type,
                selector,
                filter,
              );
              if (value === null) return resolve(null);
              else {
                elementResultObj[name] = value;
                resolve(value);
              }
            }

            elementParameters.forEach(handleElement);
          });
          if (Object.keys(elementResultObj).length != 0) {
            this.state.result.push(elementResultObj);
          }
        } else {
          // const temp: { [key: string]: string } = {};
          const type = this.state.info.selectorType;
          const selectorName = this.state.info.selectorName;

          console.log(
            "🚀 🟦 evaluateElements 🟦 execute 🟦 selectorName:",
            selectorName,
          );

          const returnElement = await page?.evaluate(
            (innerElement: any, type) => {
              return innerElement[type];
            },
            element,
            type,
          );
          // temp[selectorName] = returnElement;

          this.state.result.push({
            [selectorName]: returnElement,
          });
        }
      }
    }
    {
      throw new Error("No elements found");
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

export class printResultAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    // console.log(this.state.result);
    const info = [this.state.info.title, this.state.info.link];

    stringify(
      this.state.result,
      { header: true, columns: ["title", "link"] },
      (err, csv) => {
        if (err) throw err;
        writeFileSync("./result.csv", info + "\r", { flag: "a" });
        writeFileSync("./result.csv", csv + "\r", { flag: "a" });
      },
    );
  }
}
