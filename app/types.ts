import { Action } from "./lib/Action";

// export type mapActions = {
//   loadBrowser: string;
//   closeBrowser: string;
//   waitPageNavigation: string;
//   waitSelector: string;
// };

export type mapActions =
  | "loadBrowser"
  | "closeBrowser"
  | "waitPageNavigation"
  | "waitSelector";
