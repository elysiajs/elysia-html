/**
 * There's no real way to validate HTML, so this is a best guess.
 *
 * Ignores surrounding whitespace without copying the string, because
 * automatic detection runs on every string response.
 *
 * @see https://stackoverflow.com/q/1732348
 * @see https://stackoverflow.com/q/11229831
 */
export function isHtml(this: void, value?: unknown): value is string {
	if (typeof value !== 'string') return false

	let start = 0
	let end = value.length - 1

	while (start <= end && value.charCodeAt(start) <= 32) start++
	while (end >= start && value.charCodeAt(end) <= 32) end--

	return (
		// Minimum html is 7 characters long: <a></a>
		end - start >= 6 &&
		value.charCodeAt(start) === 60 /* < */ &&
		value.charCodeAt(end) === 62 /* > */
	)
}

/**
 * Returns true if the string starts with `<html`, **ignores whitespace and
 * casing**.
 */
export const isTagHtml: (this: void, value: string) => boolean =
	RegExp.prototype.test.bind(/^\s*<html/i)

let nextRequestId = 0

/**
 * Generates compact process-local request IDs. They only need to be unique
 * among requests in flight, and the mask keeps the counter a small integer.
 */
export function defaultRequestId(this: void) {
	nextRequestId = (nextRequestId + 1) & 2147483647
	return `req-${nextRequestId.toString(36)}`
}
