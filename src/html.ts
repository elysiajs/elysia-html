import { Elysia, StatusMap } from 'elysia'
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
	}).derive({ as: 'global' }, ({ set }) => {

		return {
			html(
				value: Readable | JSX.Element
			): Promise<Response | string> | Response | string {
				const status = typeof set.status === 'string' ? StatusMap[set.status] : set.status
				return handleHtml(value, options, 'content-type' in set.headers, status)
			},
			stream<A = any>(
				value: (this: void, arg: A & { id: number }) => JSX.Element,
				args: A
			) {
				const status = typeof set.status === 'string' ? StatusMap[set.status] : set.status
				return handleHtml(
					renderToStream((id) =>
						(value as Function)({ ...args, id })
					),
					options,
					'content-type' in set.headers,
					status
				)
			}
		}
	})

	if (options.autoDetect)
		return instance.mapResponse(
			{ as: 'global' },
			async function handlerPossibleHtml({ response: value, set }) {
				if (
					// Simple html string
					isHtml(value) ||
					// @kitajs/html stream
					(value instanceof Readable && 'rid' in value)
				) {
					const status = typeof set.status === 'string' ? StatusMap[set.status] : set.status

					const response = await handleHtml(
						value,
						options,
						'content-type' in set.headers,
						status
					)

					if (response instanceof Response) return response

					set.headers['content-type'] = options.contentType!

					return new Response(response)
				}

				return undefined
			}
		)

	return instance
}
