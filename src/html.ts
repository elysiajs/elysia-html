import { Elysia } from 'elysia'
import { isHtml, isTagHtml } from './utils'
import { HtmlOptions } from './options'

export function html(options: HtmlOptions = {}) {
	// Defaults
	options.contentType ??= 'text/html; charset=utf8'
	options.autoDetect ??= true
	options.isHtml ??= isHtml
	options.autoDoctype ??= true

	let instance = new Elysia({ name: '@elysiajs/html' }).derive(() => ({
		html(value: string) {
			if (
				options.autoDoctype &&
				isHtml(value) &&
				// Avoids double adding !doctype or adding to non root html tags.
				isTagHtml(value)
			) {
				value = '<!doctype html>' + value
			}

			return new Response(value, {
				headers: { 'content-type': options.contentType! }
			})
		}
	}))

	if (options.autoDetect) {
		instance = instance.onAfterHandle(
			// onAfterHandle should be present on a lot of stack traces, so we should not
			// use anonymous functions here.
			function htmlHandle({ set }, response) {
				if (!isHtml(response)) {
					return
				}

				// Full means that we should only try to convert raw string responses
				if (options.autoDoctype === 'full' && isTagHtml(response)) {
					response = '<!doctype html>' + response
				}

				set.headers['content-type'] = options.contentType!

				return new Response(
					// @ts-expect-error - We know this is a string.
					response,
					set
				)
			}
		)
	}

	return instance
}
