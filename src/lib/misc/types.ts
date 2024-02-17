// export type mapActions = {
//   loadBrowser: string;
//   closeBrowser: string;
//   waitPageNavigation: string;
//   waitSelector: string;
// };

export type mapActions =
  | "loadBrowser"
  | "page$"
  | "addTitle"
  | "page$$"
  | "printResult"
  | "closeBrowser"
  | "waitPageNavigation"
  | "openNewPage"
  | "evaluateElements"
  | "addExtractType"
  | "type"
  | "waitSelector";
