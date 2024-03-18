import { Readable } from 'stream'
import { HtmlOptions } from './options'
import { isHtml, isTagHtml } from './utils'

export function handleHtml(
	value: string | Readable | Promise<string | Readable>,
	options: HtmlOptions,
	hasContentType: boolean
): Promise<Response | string> | Response | string {
	// Only use promises if value is a promise itself
	if (value instanceof Promise) {
		return value.then((v) => handleHtml(v, options, hasContentType))
	}

	// Simple string use cases
	if (typeof value === 'string') {
		if (
			options.autoDoctype &&
			isHtml(value) &&
			// Avoids double adding !doctype or adding to non root html tags.
			isTagHtml(value)
		)
			value = '<!doctype html>' + value

		return new Response(
			value,
			hasContentType
				? undefined
				: { headers: { 'content-type': options.contentType! } }
		)
	}

	// Stream use cases
	let stream = Readable.toWeb(value)

	// We can convert to a readable stream with StreamTransform
	if (options.autoDoctype) {
		let first = true

		stream = stream.pipeThrough(
			new TransformStream({
				transform(chunk, controller) {
					let str = chunk!.toString()

					if (
						first &&
						isTagHtml(str) &&
						// Avoids double adding !doctype or adding to non root html tags.
						isTagHtml(str)
					) {
						first = false
						str = '<!doctype html>' + str
					}

					controller.enqueue(str)
				}
			}) as any
		)
	}

	return new Response(
		stream as any,
		hasContentType
			? undefined
			: { headers: { 'content-type': options.contentType! } }
	)
}
