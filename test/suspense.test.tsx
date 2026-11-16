import { afterEach, describe, expect, it } from 'bun:test'
import { Elysia, status } from 'elysia'
import {
	AutoSuspense,
	renderToStream,
	Suspense,
	SuspenseRoot
} from '@kitajs/html/suspense'
import { html } from '../src'

const req = (path: string, init?: RequestInit) =>
	new Request(`http://localhost${path}`, init)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function Slow({ ms = 10, text = 'loaded' }: { ms?: number; text?: string }) {
	await sleep(ms)
	return <p safe>{text}</p>
}

/** Waits for streams released through abort paths. */
async function expectNoPendingState() {
	for (let i = 0; i < 20 && SuspenseRoot.requests.size; i++) await sleep(5)

	expect(SuspenseRoot.requests.size).toBe(0)
}

afterEach(() => {
	SuspenseRoot.requests.clear()
})

describe('Suspense', () => {
	it('streams boundaries passed to html()', async () => {
		const app = new Elysia().use(html()).get('/', ({ html, rid }) =>
			html(
				<div>
					<Suspense rid={rid} fallback={<i>loading</i>}>
						<Slow />
					</Suspense>
				</div>
			)
		)

		const res = await app.handle(req('/'))
		const body = await res.text()

		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(body).toStartWith('<div><div id="B:req-')
		expect(body).toContain('<i>loading</i>')
		expect(body).toContain('<template id="N:req-')
		expect(body).toContain('<p>loaded</p>')
		await expectNoPendingState()
	})

	it('streams boundaries returned directly', async () => {
		const app = new Elysia().use(html()).get('/', ({ rid }) => (
			<html>
				<body>
					<Suspense rid={rid} fallback={<i>loading</i>}>
						<Slow />
					</Suspense>
				</body>
			</html>
		))

		const res = await app.handle(req('/'))
		const body = await res.text()

		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(body).toStartWith('<!doctype html><html><body>')
		expect(body).toContain('<p>loaded</p>')
		await expectNoPendingState()
	})

	it('keeps boundaries that settle before an async root', async () => {
		async function Layout({ children }: { children: JSX.Element }) {
			await sleep(20)
			return <main>{children}</main>
		}

		const app = new Elysia().use(html()).get('/', ({ html, rid }) =>
			html(
				<Layout>
					<Suspense rid={rid} fallback={<i>loading</i>}>
						{Promise.resolve(<b>fast</b>)}
					</Suspense>
				</Layout>
			)
		)

		const body = await (await app.handle(req('/'))).text()

		expect(body).toStartWith('<main><div id="B:req-')
		expect(body).toContain('<b>fast</b>')
		await expectNoPendingState()
	})

	it('reserves state for factories that create boundaries after await', async () => {
		const app = new Elysia().use(html()).get('/', ({ html }) =>
			html(async () => {
				await sleep(5)

				return (
					<html>
						<AutoSuspense fallback={<i>loading</i>}>
							{Promise.resolve(<b>late</b>)}
						</AutoSuspense>
					</html>
				)
			})
		)

		const res = await app.handle(req('/'))
		const body = await res.text()

		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(body).toStartWith('<!doctype html><html><div id="B:req-')
		expect(body).toContain('<b>late</b>')
		await expectNoPendingState()
	})

	it('rethrows synchronous factory errors', async () => {
		const app = new Elysia().use(html()).get('/', ({ html }) =>
			html(() => {
				throw new Error('boom')
			})
		)

		const res = await app.handle(req('/'))

		expect(res.status).toBe(500)
		await expectNoPendingState()
	})

	it('propagates request ids to AutoSuspense with autoSuspense', async () => {
		const app = new Elysia()
			.use(html({ autoSuspense: true }))
			.get('/', async ({ rid }) => {
				await sleep(1)

				return (
					<div data-rid={String(rid)}>
						<AutoSuspense fallback={<i>loading</i>}>
							<Slow />
						</AutoSuspense>
					</div>
				)
			})

		const body = await (await app.handle(req('/'))).text()
		const rid = /data-rid="([^"]+)"/.exec(body)![1]

		expect(body).toContain(`id="B:${rid}:1"`)
		expect(body).toContain('<p>loaded</p>')
		await expectNoPendingState()
	})

	it('rejects AutoSuspense without autoSuspense', async () => {
		const app = new Elysia().use(html()).get('/', () => (
			<AutoSuspense fallback={<i>loading</i>}>
				<Slow />
			</AutoSuspense>
		))

		const res = await app.handle(req('/'))

		expect(res.status).toBe(500)
	})

	it('isolates concurrent requests', async () => {
		const app = new Elysia()
			.use(html({ autoSuspense: true }))
			.get('/:n', ({ params }) => (
				<div>
					<AutoSuspense fallback={<i>loading</i>}>
						<Slow ms={Math.random() * 20} text={params.n} />
					</AutoSuspense>
				</div>
			))

		const bodies = await Promise.all(
			Array.from({ length: 50 }, (_, i) =>
				app.handle(req(`/${i}`)).then((res) => res.text())
			)
		)

		bodies.forEach((body, i) => {
			expect(body).toContain(`<p>${i}</p>`)
			expect(body.match(/<template /g)).toHaveLength(1)
		})
		await expectNoPendingState()
	})

	it('uses genRequestId', async () => {
		let n = 0
		const app = new Elysia()
			.use(html({ genRequestId: () => `custom${++n}` }))
			.get('/', ({ rid }) => (
				<Suspense rid={rid} fallback={<i>loading</i>}>
					<Slow />
				</Suspense>
			))

		const body = await (await app.handle(req('/'))).text()

		expect(body).toStartWith('<div id="B:custom1:1" data-sf>')
	})

	it('streams the catch fallback of failed boundaries', async () => {
		async function Fail(): Promise<string> {
			await sleep(1)
			throw new Error('failed')
		}

		const app = new Elysia().use(html()).get('/', ({ rid }) => (
			<Suspense
				rid={rid}
				fallback={<i>loading</i>}
				catch={<b>error</b>}
			>
				<Fail />
			</Suspense>
		))

		const body = await (await app.handle(req('/'))).text()

		expect(body).toContain('<b>error</b>')
		await expectNoPendingState()
	})

	it('releases state for HEAD requests', async () => {
		const app = new Elysia().use(html()).head('/', ({ html, rid }) =>
			html(
				<Suspense rid={rid} fallback={<i>loading</i>}>
					<Slow ms={1000} />
				</Suspense>
			)
		)

		const res = await app.handle(req('/', { method: 'HEAD' }))

		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(await res.text()).toBe('')
		expect(SuspenseRoot.requests.size).toBe(0)
	})

	it('releases state when the request is aborted', async () => {
		const controller = new AbortController()
		const app = new Elysia().use(html()).get('/', ({ rid }) => (
			<Suspense rid={rid} fallback={<i>loading</i>}>
				<Slow ms={1000} />
			</Suspense>
		))

		const res = await app.handle(req('/', { signal: controller.signal }))
		const reader = res.body!.getReader()
		await reader.read()

		expect(SuspenseRoot.requests.size).toBe(1)
		controller.abort()
		await expectNoPendingState()
	})

	it('releases state when the response body is cancelled', async () => {
		const app = new Elysia().use(html()).get('/', ({ rid }) => (
			<Suspense rid={rid} fallback={<i>loading</i>}>
				<Slow ms={1000} />
			</Suspense>
		))

		const res = await app.handle(req('/'))
		const reader = res.body!.getReader()
		await reader.read()

		expect(SuspenseRoot.requests.size).toBe(1)
		await reader.cancel()
		await expectNoPendingState()
	})

	it('sends streams rendered by renderToStream', async () => {
		const app = new Elysia().use(html()).get('/', ({ html }) =>
			html(
				renderToStream((rid) => (
					<Suspense rid={rid} fallback={<i>loading</i>}>
						<Slow />
					</Suspense>
				))
			)
		)

		const res = await app.handle(req('/'))

		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(await res.text()).toContain('<p>loaded</p>')
	})
})

describe('status', () => {
	it('sends html passed to status() as html', async () => {
		const app = new Elysia()
			.use(html())
			.get('/', () => status(404, <div>not found</div>))

		const res = await app.handle(req('/'))

		expect(res.status).toBe(404)
		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
		expect(await res.text()).toBe('<div>not found</div>')
	})

	it('keeps set.status and headers', async () => {
		const app = new Elysia().use(html()).get('/', ({ set }) => {
			set.status = 422
			set.headers['x-test'] = 'yes'
			return <div>invalid</div>
		})

		const res = await app.handle(req('/'))

		expect(res.status).toBe(422)
		expect(res.headers.get('x-test')).toBe('yes')
		expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
	})

	it('keeps a content type set by the handler', async () => {
		const app = new Elysia().use(html()).get('/', ({ html, set }) => {
			set.headers['content-type'] = 'application/xhtml+xml'
			return html(<div>x</div>)
		})

		const res = await app.handle(req('/'))

		expect(res.headers.get('content-type')).toBe('application/xhtml+xml')
	})
})
