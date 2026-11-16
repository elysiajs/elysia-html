import { Elysia, ElysiaStatus } from 'elysia'
import { runWithAutoSuspense, SuspenseRoot } from '@kitajs/html/suspense'

import {
	renderHtml,
	renderHtmlFactory,
	type HtmlHelper,
	type HtmlRequest,
	type HtmlRuntime
} from './handler'
import type { HtmlOptions } from './options'
import { defaultRequestId, isHtml } from './utils'

export function html(options: HtmlOptions = {}) {
	const contentType = options.contentType ?? 'text/html; charset=utf-8'
	const runtime: HtmlRuntime = {
		contentType,
		autoDoctype: options.autoDoctype ?? true,
		init: { headers: { 'content-type': contentType } }
	}
	const detect = options.isHtml ?? isHtml
	const genRequestId = options.genRequestId ?? defaultRequestId
	const autoSuspense = options.autoSuspense ?? false

	function requestId(request: Request) {
		const rid = genRequestId(request)

		// renderToStream replaces an empty ID with its own counter, which would
		// detach the Suspense state from this request.
		if (rid === '' || rid === undefined || rid === null)
			throw new TypeError(
				'`genRequestId` must return a non-empty string or a number.'
			)

		return rid
	}

	const instance = new Elysia({
		name: '@elysia/html',
		seed: options
	})

	if (autoSuspense)
		// Wraps the whole fetch so hooks, the handler and response mapping share
		// the same async-local request ID used by AutoSuspense.
		instance.wrap((fetch) => (request: Request, ...rest: any[]) =>
			runWithAutoSuspense(requestId(request), () =>
				fetch(request, ...rest)
			)
		)

	const withHtml = instance.derive(
		'plugin',
		function htmlPlugin({ request, set }) {
			const rid = autoSuspense
				? (SuspenseRoot.requestIdStorage.getStore() ??
					requestId(request))
				: requestId(request)

			const req: HtmlRequest = { rid, request, set }

			return {
				/** The request ID to pass as `rid` to `Suspense` boundaries. */
				rid,
				html: function html(value: any) {
					return typeof value === 'function'
						? renderHtmlFactory(value, req, runtime)
						: renderHtml(value, req, runtime)
				} as HtmlHelper
			}
		}
	)

	if (options.autoDetect ?? true)
		withHtml.mapResponse(
			'plugin',
			function handlePossibleHtml({ responseValue, request, set, rid }) {
				if (typeof responseValue === 'string') {
					if (!detect(responseValue)) return

					return renderHtml(responseValue, { rid, request, set }, runtime)
				}

				if (
					!(responseValue instanceof ElysiaStatus) ||
					typeof responseValue.response !== 'string' ||
					!detect(responseValue.response)
				)
					return

				return renderHtml(
					responseValue.response,
					{ rid, request, set },
					runtime,
					responseValue
				)
			}
		)

	return withHtml
}
