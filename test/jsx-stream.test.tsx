import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { html } from '../src'
import { Suspense, renderToStream, SuspenseScript } from '@kitajs/html/suspense'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

function handler() {
	return renderToStream(() => htmlContent)
}

const htmlContent = (
	<>
		{'<!DOCTYPE HTML>'}
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	</>
)

describe('Jsx html', () => {
	it('auto return html', async () => {
		const app = new Elysia().use(html()).get('/', handler)
		const res = await app.handle(request('/'))

		expect(await res.text()).toBe(htmlContent)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('auto return html with built in handler', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', ({ html }) => html(() => htmlContent))

		const res = await app.handle(request('/'))

		expect(await res.text()).toBe(htmlContent)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('works with async suspense', async () => {
		const app = new Elysia().use(html()).get('/', ({ html }) =>
			html((rid) => (
				<div>
					<Suspense rid={rid} fallback={<div>1</div>}>
						{Promise.resolve(<div>2</div>)}
					</Suspense>
				</div>
			))
		)

		const res = await app.handle(request('/'))

		expect(res.headers.get('Content-Type')).toContain('text/html')
		expect(await res.text()).toBe(
			<>
				<div>
					<div id="B:1" data-sf>
						<div>1</div>
					</div>
				</div>
				{SuspenseScript}
				<template id="N:1" data-sr>
					<div>2</div>
				</template>
				<script id="S:1" data-ss>
					$RC(1)
				</script>
			</>
		)
	})
})

describe('HTML', () => {
	it('manual return html', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', ({ html }) => html(handler()))

		const res = await app.handle(request('/'))
		expect(await res.text()).toBe(htmlContent)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('inherits header', async () => {
		const app = new Elysia().use(html()).get('/', ({ html, set }) => {
			set.headers.Server = 'Elysia'
			return html(<h1>Hi</h1>)
		})

		const res = await app.handle(request('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
	})

	it('return any html tag', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', () => <html>Hello World</html>)

		const res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
	})

	it('consistently identifies html content', async () => {
		const app = new Elysia().use(html()).get('/', () => <h1></h1>)

		let res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
		res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
		res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
	})
})
