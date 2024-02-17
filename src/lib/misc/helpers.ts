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
