import { Elysia } from 'elysia'
import { Readable } from 'node:stream'
import { renderToStream } from '@kitajs/html/suspense'

import { handleHtml } from './handler'
import { HtmlOptions } from './options'
import { isHtml, isTagHtml } from './utils'

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

	if (options.autoDetect)
		instance.mapResponse(
			{ as: 'global' },
			function handlerPossibleHtml({ response: value, set }) {
				if (
					!(
						// Simple html string
						(
							isHtml(value) ||
							// @kitajs/html stream
							(value instanceof Readable && 'rid' in value)
						)
					)
				)
					return

				if (typeof value === 'string')
					return handleHtml(
						value,
						options,
						'content-type' in set.headers
					)
			}
		)

	return instance
}
