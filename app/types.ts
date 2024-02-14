import { Action } from "./lib/Action";

// export type mapActions = {
//   loadBrowser: string;
//   closeBrowser: string;
//   waitPageNavigation: string;
//   waitSelector: string;
// };

export type mapActions =
  | "loadBrowser"
  | "page$"
  | "page$$"
  | "printResult"
  | "closeBrowser"
  | "waitPageNavigation"
  | "openNewPage"
  | "evaluateElements"
  | "addExtractType"
  | "type"
  | "waitSelector";
