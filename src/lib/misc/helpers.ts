export function toResult(
  element: any,
  innerSelector: string,
  extractType: string,
) {
  const e = element.querySelector(`${innerSelector}`);
  if (e) {
    return e[extractType];
  }
}
