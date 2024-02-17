import db from "../database/Database";
import { mapActions } from "../types";
import {
  Action,
  addExtractTypeAction,
  addTitleAction,
  closeBrowserAction,
  evaluateElements,
  loadBrowserAction,
  openNewPageAction,
  page$,
  page$$,
  printResultAction,
  typeAction,
  waitForPageNavigationAction,
  waitForSelector,
} from "./Action";
import { State } from "./State";

interface addToDatabase {
  addToDatabase(): void;
}

export class Invoker implements addToDatabase {
  private onStart: Action | null = null;
  private onEnd: Action | null = null;
  private actions: { action: mapActions; parameters: string[] }[] = [];
  public state: State;

  private hashmap: {
    [K in mapActions]: new (...arg: any) => Action;
  } = {
    evaluateElements: evaluateElements,
    addTitle: addTitleAction,
    page$: page$,
    page$$: page$$,
    addExtractType: addExtractTypeAction,
    openNewPage: openNewPageAction,
    loadBrowser: loadBrowserAction,
    closeBrowser: closeBrowserAction,
    waitPageNavigation: waitForPageNavigationAction,
    printResult: printResultAction,
    waitSelector: waitForSelector,
    type: typeAction,
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
  addAction<A extends keyof typeof this.hashmap>(
    action: A,
    ...params: ConstructorParameters<(typeof this.hashmap)[A]>
  ) {
    this.actions.push({
      action: action,
      parameters: params,
    });
  }
  async activate() {
    await this.onStart?.execute();
    for (const { action, parameters } of this.actions) {
      try {
        const actionClass = new this.hashmap[action](...parameters);
        await actionClass.execute();
      } catch (err) {
        if (err instanceof Error) console.log(err.name);
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
  async addToDatabase(): Promise<void> {
    try {
      const actions = this.actions.map((action) => {
        return {
          action: action.action,
          parameters: action.parameters,
        };
      });

      console.log(actions);
      console.log(this.state.info.link, "1");
      console.log(this.state.info.title, "2");
      // await db.scrap_Instance.create({
      //   data: {
      //     title: this.state.info.title,
      //     url: this.state.info.link,
      //     // scrap_actions: this.actions as {
      //     //   action: string;
      //     //   parameters: string[];
      //     // }[],
      //   },
      // });
    } catch (err) {
      throw new Error();
    }
  }
}
