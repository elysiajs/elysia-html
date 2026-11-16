import { Readable } from 'node:stream'
import {
	abortSuspenseRequest,
	renderToStream,
	resolveHtmlStream,
	runWithAutoSuspense,
	SuspenseRoot,
	type RequestData
} from '@kitajs/html/suspense'
import { isTagHtml } from './utils'

/** Render callback accepted by the `html()` context helper. */
export type HtmlRender = (this: void, rid: string | number) => JSX.Element

/** The `html()` helper added to the Elysia context. */
export interface HtmlHelper {
	/**
	 * Renders a JSX tree inside a request-owned Suspense session and always
	 * streams the response.
	 *
	 * Use this form when an async root creates its first `Suspense` or
	 * `AutoSuspense` boundary after an `await`. `AutoSuspense` works here even
	 * without the `autoSuspense` option.
	 */
	(render: HtmlRender): Response

	/**
	 * Sends HTML with the configured content type. When the JSX tree contains
	 * `Suspense` boundaries for this request, the response is streamed.
	 */
	<H extends JSX.Element>(
		html: H
	): H extends Promise<string> ? Promise<Response> : Response

	/** Sends an already rendered stream, such as one from `renderToStream`. */
	(stream: Readable): Response
}

/** Per-request state needed to build an HTML response. */
export interface HtmlRequest {
	rid: string | number | undefined
	request: Request
	set: { headers: Record<string, unknown> }
}

/** Plugin options after defaults were applied. */
export interface HtmlRuntime {
	autoDoctype: boolean
	/** Shared init used by most responses, so it is only allocated once. */
	init: ResponseInit
	contentType: string
}

/** Status and headers coming from `status()`. */
export interface HtmlStatus {
	status: number
	headers?: Record<string, string> | undefined
}

export function renderHtml(
	value: JSX.Element | Readable,
	req: HtmlRequest,
	runtime: HtmlRuntime,
	status?: HtmlStatus
): Response | Promise<Response> {
	if (typeof value === 'string')
		return renderStringHtml(value, req, runtime, status)

	if (value instanceof Readable)
		return new Response(toWeb(value), responseInit(req, runtime, status))

	return renderAsyncHtml(value, req, runtime, status)
}

/**
 * Captures Suspense state before awaiting the root. Otherwise a fast boundary
 * could finish and release the state while the root is still pending, and its
 * replacement content would never be sent.
 */
function renderAsyncHtml(
	html: Promise<string>,
	req: HtmlRequest,
	runtime: HtmlRuntime,
	status: HtmlStatus | undefined
): Promise<Response> | Response {
	const data =
		req.rid === undefined ? undefined : SuspenseRoot.requests.get(req.rid)

	if (!data)
		return html.then((value) =>
			renderStringHtml(value, req, runtime, status)
		)

	return renderStreamHtml(
		html.then((value) => prepareHtml(value, runtime)),
		data,
		req,
		runtime,
		status
	)
}

function renderStringHtml(
	html: string,
	req: HtmlRequest,
	runtime: HtmlRuntime,
	status: HtmlStatus | undefined
) {
	html = prepareHtml(html, runtime)

	// Only defined when a Suspense boundary of this request is still pending.
	const data =
		req.rid === undefined ? undefined : SuspenseRoot.requests.get(req.rid)

	if (!data) return new Response(html, responseInit(req, runtime, status))

	return renderStreamHtml(html, data, req, runtime, status)
}

function renderStreamHtml(
	template: JSX.Element,
	data: RequestData,
	req: HtmlRequest,
	runtime: HtmlRuntime,
	status: HtmlStatus | undefined
) {
	const stream = resolveHtmlStream(template, data)
	const init = responseInit(req, runtime, status)

	if (req.request.method === 'HEAD') {
		// HEAD never sends the body, so release the state now instead of
		// keeping it until the slowest boundary settles. Also destroys the stream.
		abortSuspenseRequest(data.rid, data)
		return new Response(null, init)
	}

	observeSuspense(req.request, data, stream)

	return new Response(toWeb(stream), init)
}

/**
 * Renders a JSX factory in a Suspense session reserved before the factory
 * runs, so boundaries created after an `await` in the root still belong to
 * this response.
 */
export function renderHtmlFactory(
	render: HtmlRender,
	req: HtmlRequest,
	runtime: HtmlRuntime
): Response {
	// A flag instead of checking the error, because `throw undefined` is legal.
	let threw = false
	let error: unknown

	const stream = renderToStream(
		(rid) =>
			runWithAutoSuspense(rid, () => {
				let html: JSX.Element

				try {
					html = render(rid)
				} catch (e) {
					threw = true
					error = e
					throw e
				}

				return typeof html === 'string'
					? prepareHtml(html, runtime)
					: html.then((value) => prepareHtml(value, runtime))
			}),
		req.rid
	)

	// renderToStream turns factory throws into stream errors. Rethrow so
	// Elysia's error handling runs instead of sending a 200 that fails to read.
	if (threw) throw error

	const data =
		req.rid === undefined ? undefined : SuspenseRoot.requests.get(req.rid)
	const init = responseInit(req, runtime, undefined)

	if (req.request.method === 'HEAD') {
		if (data) abortSuspenseRequest(data.rid, data)
		else stream.destroy()

		return new Response(null, init)
	}

	if (data) observeSuspense(req.request, data, stream)

	return new Response(toWeb(stream), init)
}

function prepareHtml(html: string, runtime: HtmlRuntime) {
	if (runtime.autoDoctype && isTagHtml(html)) return '<!doctype html>' + html

	return html
}

function responseInit(
	req: HtmlRequest,
	runtime: HtmlRuntime,
	status: HtmlStatus | undefined
): ResponseInit | undefined {
	// A content type set by the handler wins, Elysia merges it into the response.
	const keepType = 'content-type' in req.set.headers

	if (!status) return keepType ? undefined : runtime.init

	const headers: Record<string, string> = { ...status.headers }

	if (!keepType && !('content-type' in headers))
		headers['content-type'] = runtime.contentType

	return { status: status.status, headers }
}

/**
 * Releases Suspense state when the client goes away before the stream ends.
 *
 * The response stream closing before it ended is also treated as an abort,
 * because runtimes may never report a disconnect through the request signal.
 * The captured `data` identity prevents an old response from aborting a newer
 * request that reuses the same ID.
 */
function observeSuspense(request: Request, data: RequestData, stream: Readable) {
	const signal = request.signal

	if (signal.aborted) return abort()

	signal.addEventListener('abort', abort, { once: true })

	stream.once('close', function onStreamClose() {
		signal.removeEventListener('abort', abort)

		if (!stream.readableEnded) abort()
	})

	function abort() {
		abortSuspenseRequest(data.rid, data)
	}
}

function toWeb(stream: Readable) {
	return Readable.toWeb(stream) as unknown as ReadableStream
}
