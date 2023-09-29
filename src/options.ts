/**
 * Options for @elysiajs/html plugin.
 *
 * @link https://elysiajs.com/plugins/html.html
 */
export interface HtmlOptions {
	/**
	 * The content-type of the response.
	 *
	 * @default 'text/html; charset=utf8'
	 */
	contentType?: string

	/**
	 * Whether to automatically detect HTML content and set the content-type.
	 *
	 * @default true
	 */
	autoDetect?: boolean

	/**
	 * Whether to automatically add `<!doctype html>` to a response starting with <html>, if not found.
	 *
	 * Use `full` to also automatically add doctypes on responses returned without this plugin
	 *
	 * ```ts
	 * // without the plugin
	 * app.get('/', () => '<html></html>')
	 *
	 * // With the plugin
	 * app.get('/', ({ html }) => html('<html></html>')
	 * ```
	 *
	 * @default true
	 */
	autoDoctype?: boolean | 'full'

	/**
	 * The function used to detect if a string is a html or not. Default
	 * implementation if length is greater than 3, starts with `<` and ends
	 * with `>`.
	 *
	 * There's no real way to validate HTML, so this is a best guess.
	 *
	 * @see https://stackoverflow.com/q/1732348
	 * @see https://stackoverflow.com/q/11229831
	 *
	 * @default isHtml
	 */
	isHtml?: (this: void, value: string) => boolean
}
