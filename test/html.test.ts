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

	it('returns result of onError callback', async () => {
		class NotAuthorizedError extends Error {
			code: string = "NOT_AUTHORIZED"
			status: number = 401
			constructor() { super("Not authorized") }
		}

		const authorized = new Elysia({ name: "authorized" })
			.derive({ as: "scoped" }, ({ path }) => {
				if (path.includes("inner")) throw new NotAuthorizedError
				return { user: 0 }
			})

		const app = new Elysia()
			.onError(({ error, redirect }) => {
				if (error instanceof NotAuthorizedError) return redirect("/")
				throw error
			})
			.get("/", "hello")
			.use(html())
			.use(authorized)
			.get("/inner", ({ }) => ("<h2>not reached</h2>"))

		const res = await app.handle(request("/inner"))
		expect(res.status + "").toStartWith("3")
	})
})
