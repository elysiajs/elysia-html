import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { html } from '../src'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

function handler() {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>		
		`
}

describe('Jsx html', () => {
	it('auto return html', async () => {
		const app = new Elysia().use(html()).get('/', handler)
		const res = await app.handle(request('/'))
		expect(await res.text()).toBe(handler())
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})
})

describe('HTML', () => {
	it('manual return html', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', ({ html }) => html(handler()))

		const res = await app.handle(request('/'))
		expect(await res.text()).toBe(handler())
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('inherits header', async () => {
		const app = new Elysia().use(html()).get('/', ({ html, set }) => {
			set.headers.Server = 'Elysia'
			return html(`<h1>Hi</h1>`)
		})

		const res = await app.handle(request('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
	})

	it('return any html tag', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', () => `<html>Hello World</html>`)

		const res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})

	it('consistently identifies html content', async () => {
		const app = new Elysia().use(html()).get('/', () => `<h1></h1>`)

		let res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.handle(request('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})

	it('keeps the original request when in autoDetect and html is not detected', async () => {
		const app = new Elysia()
			.use(html())
			.onError(({ set} ) => {
				set.status = 'OK'
				return 'ok'
			})
			.get(
				'/',
				() => {
					throw 'not ok'
				}
			)

		let res = await app.handle(request('/'))
		expect(res.status).toBe(200)
		expect(await res.text()).toBe('ok')
	})
})
