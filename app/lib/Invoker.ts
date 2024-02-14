import { mapActions } from "../types";
import {
  Action,
  addExtractTypeAction,
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

export class Invoker {
  private onStart: Action | null = null;
  private onEnd: Action | null = null;
  private actions: { action: mapActions; parameters: string[] }[] = [];
  public state: State;

  private hashmap: {
    [K in mapActions]: new (...arg: any) => Action;
  } = {
    evaluateElements: evaluateElements,
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
        if (err instanceof Error) console.log(err.message);
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
