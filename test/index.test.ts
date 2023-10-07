import { Elysia } from 'elysia'
import { html } from '../src'

import { describe, expect, it } from 'bun:test'

const req = (path: string) => new Request(`http://localhost${path}`)

const page = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

describe('HTML', () => {
	it('auto return html', async () => {
		const app = new Elysia().use(html()).get('/', () => page)

		const res = await app.handle(req('/'))
		expect(await res.text()).toBe(page)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('manual return html', async () => {
		const app = new Elysia().use(html()).get('/', ({ html }) => html(page))

		const res = await app.handle(req('/'))
		expect(await res.text()).toBe(page)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('inherits header', async () => {
		const app = new Elysia().use(html()).get('/', ({ html, set }) => {
			set.headers.Server = 'Elysia'
			return html('<h1>Hi</h1>')
		})

		const res = await app.handle(req('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
	})

	it('return any html tag', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', () => `<html>Hello World</html>`)

		const res = await app.handle(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})

	it('consistently identifies html content', async () => {
		const app = new Elysia().use(html()).get('/', () => `<h1>Hi</h1>`)

		let res = await app.handle(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.handle(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.handle(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})
})

describe('HTML vs No html - header', () => {
	it('inherits header plain response when using the html plugin', async () => {
		const app = new Elysia().use(html()).get('/', ({ set }) => {
			set.headers.Server = 'Elysia'
			return 'Hello'
		})
		const res = await app.handle(req('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
	})

	it('inherits header plain response not using the html plugin', async () => {
		const app = new Elysia().get('/', ({ set }) => {
			set.headers.Server = 'Elysia'
			return 'Hello'
		})
		const res = await app.handle(req('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
		expect(res.headers.get('Content-Type')).toBe(null)
	})

	it('inherits header json response when using the html plugin', async () => {
		const app = new Elysia().use(html()).get('/', ({ set }) => {
			set.headers.Server = 'Elysia'
			return { Hello: 1 }
		})
		const res = await app.handle(req('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
	})

	it('inherits header json response not using the html plugin', async () => {
		const app = new Elysia().get('/', ({ set }) => {
			set.headers.Server = 'Elysia'
			return { Hello: 1 }
		})
		const res = await app.handle(req('/'))
		expect(res.headers.get('Server')).toBe('Elysia')
		expect(res.headers.get('Content-Type')).toBe(
			'application/json;charset=utf-8'
		)
	})
})
