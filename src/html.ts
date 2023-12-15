import { Elysia } from 'elysia'
import { Readable } from 'stream'
import { handleHtml } from './handler'
import { HtmlOptions } from './options'
import { isHtml } from './utils'
import { renderToStream } from '@kitajs/html/suspense'

export function html(options: HtmlOptions = {}) {
	// Defaults
	options.contentType ??= 'text/html; charset=utf8'
	options.autoDetect ??= true
	options.isHtml ??= isHtml
	options.autoDoctype ??= true

	let instance = new Elysia({ name: '@elysiajs/html' }).derive(({ set }) => {
		return {
			html(
				value: Readable | JSX.Element
			): Promise<Response | string> | Response | string {
				return handleHtml(value, options, 'content-type' in set.headers)
			},
			stream<A = any>(
				value: (this: void, arg: A & { id: number }) => JSX.Element,
				args: A
			) {
				return handleHtml(
					renderToStream((id) =>
						(value as Function)({ ...args, id })
					),
					options,
					'content-type' in set.headers
				)
			}
		}
	})

	if (options.autoDetect) {
		// handlerPossibleHtml should be present on a lot of stack traces, so we should not
		// use anonymous functions here.
		instance = instance.onAfterHandle(function handlerPossibleHtml({
			response: value,
			set
		}) {
			if (
				// Simple html string
				isHtml(value) ||
				// @kitajs/html stream
				(value instanceof Readable && 'rid' in value)
			) {
				return handleHtml(value, options, 'content-type' in set.headers)
			}

			return value
		})
	}

	return instance
}
