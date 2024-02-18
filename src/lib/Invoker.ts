import db from "../database/Database";
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
import { mapActions } from "./misc/types";

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
    this.onStart?.setInvoker(this);
    this.onEnd?.setInvoker(this);
    await this.onStart?.execute();
    for (const { action, parameters } of this.actions) {
      try {
        const actionClass = new this.hashmap[action](...parameters);
        actionClass.setInvoker(this);
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
      const actions = this.actions;
      const instance = await db.scrap_Instance.create({
        data: {
          title: this.state.info.title,
          url: this.state.info.link,
        },
      });
      actions.forEach(async ({ action, parameters }) => {
        const actionReturn = await db.action.create({
          data: {
            action: action,
            scrap_InstanceId: instance.id,
          },
        });

        parameters.forEach(async (param, index) => {
          if (param === "") return;
          await db.parameter.create({
            data: {
              position: index,
              value: param,
              actionId: actionReturn.id,
            },
          });
        });
        console.log(parameters);
      });

      console.log("added to database");
    } catch (err) {
      throw new Error();
    }
  }
}
