/**
 * There's no real way to validate HTML, so this is a best guess.
 *
 * @see https://stackoverflow.com/q/1732348
 * @see https://stackoverflow.com/q/11229831
 */
export function isHtml(this: void, value: string) {
  const length = value.length;
  return length > 3 && value[0] === '<' && value[length - 1] === '>';
}
