/**
 * There's no real way to validate HTML, so this is a best guess.
 *
 * @see https://stackoverflow.com/q/1732348
 * @see https://stackoverflow.com/q/11229831
 */
export function isHtml(this: void, value?: any): value is string {
	if (typeof value !== 'string')
		return false

	value = value.trim()
	const length = value.length

	return (
		// Minimum html is 7 characters long: <a></a>
		length >= 7 &&
		// open tag
		value[0] === '<' &&
		// close tag
		value[length - 1] === '>'
	)
}

/**
 * Returns true if the string starts with `<html`, **ignores whitespaces and
 * casing**.
 */
export function isTagHtml(this: void, value: string) {
	return value.trimStart().slice(0, 5).startsWith('<html')
}
