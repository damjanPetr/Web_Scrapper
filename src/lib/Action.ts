import { Page } from "puppeteer";
import { State } from "./State";
// import StealthPluggin from "puppeteer-extra-plugin-stealth";
// import puppeteer from "puppeteer-extra";
import { stringify } from "csv";
import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
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
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
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
      const test = await page.goto(this.url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      if (test == null) throw new Error("page is null");
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
    // console.log(this.selectorType);
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

    this.state.progress = 0;
    const elementParameters = this.state.extractParams;

    // * clean result array
    this.state.result = [];

    if (stateElements) {
      //* Loop through dom elements from the state
      for (let element of stateElements) {
        if (elementParameters && elementParameters?.length > 0) {
          const elementResultObj: { [key: string]: string } = {};

          let deleteFlag = false;

          const promise = await new Promise((resolve, reject) => {
            // if (deleteFlag) resolve(null);
            elementParameters.forEach(handleElement);

            //* Callback fn for Loop through array of parameters
            async function handleElement({
              name,
              selector,
              type,
              filter,
            }: NonNullable<typeof elementParameters>[number]) {
              // console.log("params", name, selector, type, filter);

              // deleteFlag = false;
              const value = await page?.evaluate(
                (innerElement: any, type, selector, filter) => {
                  if (selector === "" && filter === "") {
                    if (innerElement[type] == null) return null;
                    console.log(
                      "%c 'filter",
                      "background: cyan",
                      innerElement[type],
                    );
                    return innerElement[type];
                  }

                  if (selector === "" && filter !== "") {
                    if (
                      innerElement[type] != null &&
                      (innerElement[type] as string)
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    ) {
                      console.log(
                        "%c 'filter",
                        "background: blue",
                        innerElement[type],
                      );
                      return innerElement[type];
                    }
                    return null;
                  }

                  if (selector !== "" && filter === "") {
                    const ele = innerElement.querySelector(selector);
                    if (!ele) return null;

                    console.log("%c 'filter", "background: pink", ele[type]);

                    return ele[type];
                  }

                  if (selector !== "" && filter !== "") {
                    const ele = innerElement.querySelector(selector);
                    if (!ele) return null;

                    if (
                      ele[type] != null &&
                      (ele[type] as string)
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    ) {
                      console.log("%c 'filter", "background: green", ele[type]);
                      return ele[type];
                    }
                  }
                },
                element,
                type,
                selector,
                filter,
              );

              if (value == null) {
                deleteFlag = true;
              }
              if (value != null) {
                elementResultObj[name] = value;
              }
            }
            if (deleteFlag) resolve(null);
            else resolve(elementResultObj);
          });

          console.log(promise);
          if (!deleteFlag) this.state.result.push(promise);
          // }
        } else {
          const type = this.state.info.selectorType;
          const selectorName = this.state.info.selectorName;

          const returnElement = await page?.evaluate(
            (innerElement: any, type) => {
              return innerElement[type];
            },
            element,
            type,
          );

          this.state.result.push({
            [selectorName]: returnElement,
          });
        }
        this.state.progress += (1 / stateElements.length) * 100;
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
    // console.log(this.state.result);
  }
}

export class printResultAction extends Action {
  constructor() {
    super();
  }
  async execute() {
    const info = [this.state.info.title, this.state.info.link];
    const input = this.state.result;
    // console.log(input);
    stringify(
      input,
      // { header: true, columns: [...Object.keys(input[0])] },
      (err, csv) => {
        if (err) throw err;
        writeFileSync("./testData/result.csv", csv + "\r");
      },
    );
  }
}
