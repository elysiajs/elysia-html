/**
 * Options for @elysia/html plugin.
 *
 * @link https://elysiajs.com/plugins/html.html
 */
export interface HtmlOptions {
	/**
	 * The content-type of the response.
	 *
	 * @default 'text/html; charset=utf-8'
	 */
	contentType?: string

	/**
	 * Whether to automatically detect HTML returned by a handler and send it
	 * as an HTML response, including HTML passed to `status()`.
	 *
	 * @default true
	 */
	autoDetect?: boolean

	/**
	 * Whether to automatically add `<!doctype html>` to a response starting
	 * with `<html>`.
	 *
	 * @default true
	 */
	autoDoctype?: boolean

	/**
	 * Whether `AutoSuspense` from `@kitajs/html/suspense` receives the request
	 * ID automatically, so components do not need to pass `rid` around.
	 *
	 * @default false
	 */
	autoSuspense?: boolean

	/**
	 * Generates the ID used to isolate the Suspense output of a request.
	 *
	 * The value is embedded in HTML attributes and an inline script, so return
	 * a compact trusted string or number instead of raw request input. It must
	 * be unique among requests that are in flight in the same process.
	 *
	 * @default `req-1`, `req-2`, ... with the number in base 36
	 */
	genRequestId?: (this: void, request: Request) => string | number

	/**
	 * The function used to detect if a string is HTML when `autoDetect` is
	 * enabled. The default implementation ignores surrounding whitespace and
	 * checks that the string starts with `<` and ends with `>`.
	 *
	 * There's no real way to validate HTML, so this is a best guess.
	 *
	 * @default isHtml
	 */
	isHtml?: (this: void, value: string) => boolean
}
