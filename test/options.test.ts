import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { html } from '../src'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

describe('options', () => {
	it('tests default contentType', async () => {
		const app = new Elysia().use(html()).get('/', () => '<div></div>')
		const res = await app.handle(request('/'))

		expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8')
	})

	it('tests custom contentType', async () => {
		const ct = 'NOT TEXT HTML'

		const app = new Elysia()
			.use(html({ contentType: ct }))
			.get('/', () => '<div></div>')

		const res = await app.handle(request('/'))

		expect(res.headers.get('Content-Type')).toBe(ct)
	})

	it('tests default autoDetect', async () => {
		const app = new Elysia().use(html()).get('/', () => '<div></div>')
		const res = await app.handle(request('/'))

		expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8')
	})

	it('tests false autoDetect', async () => {
		const app = new Elysia()
			.use(html({ autoDetect: false }))
			.get('/', () => '<div></div>')
			.get('/html', ({ html }) => html('<div></div>'))

		const res = await app.handle(request('/'))
		expect(res.headers.get('Content-Type')).not.toBe(
			'text/html; charset=utf-8'
		)

		const htmlRes = await app.handle(request('/html'))
		expect(htmlRes.headers.get('Content-Type')).toBe(
			'text/html; charset=utf-8'
		)
	})

	it('tests default autoDoctype', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', ({ html }) => html('<html></html>'))
		const res = await app.handle(request('/'))

		expect(await res.text()).toBe('<!doctype html><html></html>')
	})

	it('tests false autoDoctype', async () => {
		const app = new Elysia()
			.use(html({ autoDoctype: false }))
			.get('/', ({ html }) => html('<html></html>'))
		const res = await app.handle(request('/'))

		expect(await res.text()).toBe('<html></html>')
	})

	it('tests true autoDoctype with non html tag', async () => {
		const app = new Elysia()
			.use(html({ autoDoctype: true }))
			.get('/', ({ html }) => html('<not-html></not-html>'))
		const res = await app.handle(request('/'))

		expect(await res.text()).toBe('<not-html></not-html>')
	})

	it('tests autoDoctype on automatically detected responses', async () => {
		const app = new Elysia()
			.use(html())
			.get('/invalid', () => '<not-html></not-html>')
			.get('/valid', () => '<html></html>')

		const invalid = await app.handle(request('/invalid'))
		expect(await invalid.text()).toBe('<not-html></not-html>')

		const valid = await app.handle(request('/valid'))
		expect(await valid.text()).toBe('<!doctype html><html></html>')
	})

	it('uses custom isHtml for automatic detection', async () => {
		const app = new Elysia()
			.use(html({ isHtml: (value) => value.startsWith('<x-') }))
			.get('/div', () => '<div></div>')
			.get('/custom', () => '<x-card></x-card>')

		const div = await app.handle(request('/div'))
		expect(div.headers.get('Content-Type') ?? '').not.toContain('text/html')

		const custom = await app.handle(request('/custom'))
		expect(custom.headers.get('Content-Type')).toBe(
			'text/html; charset=utf-8'
		)
	})

	it('rejects empty request ids', async () => {
		const app = new Elysia()
			.use(html({ genRequestId: () => '' }))
			.get('/', ({ html }) => html('<div></div>'))

		const res = await app.handle(request('/'))
		expect(res.status).toBe(500)
	})
})
