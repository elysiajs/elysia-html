import { Elysia } from 'elysia'
import { Readable } from 'node:stream'
import { renderToStream } from '@kitajs/html/suspense'

import { handleHtml } from './handler'
import { HtmlOptions } from './options'
import { isHtml } from './utils'

export function html(options: HtmlOptions = {}) {
	// Defaults
	options.contentType ??= 'text/html; charset=utf8'
	options.autoDetect ??= true
	options.isHtml ??= isHtml
	options.autoDoctype ??= true

	const instance = new Elysia({
		name: '@elysiajs/html',
		seed: options
	}).derive({ as: 'global' }, function htmlPlugin({ set }) {
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

	if (!options.autoDetect) return instance

	return instance
		.mapResponse({ as: 'global' }, async function handlerPossibleHtml({ response: value, set }) {
			if (!(
				// Simple html string
				isHtml(value) ||
				// @kitajs/html stream
				(value instanceof Readable && 'rid' in value)
			))
				if (value instanceof Response)
					return value
				// Hard to check if value is one of the many possible inputs for new Response, so I just went with string for now
				else if (typeof value === "string")
					return new Response(value)
				// On error handle, error message will be sent regardless of response! Not great!
				else return undefined

			const response = await handleHtml(
				value,
				options,
				'content-type' in set.headers
			)

			if (response instanceof Response) return response

			set.headers['content-type'] = options.contentType!

			return new Response(response)
		})
}
