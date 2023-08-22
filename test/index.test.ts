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
        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

    it('manual return html', async () => {
        const app = new Elysia().use(html()).get('/', ({ html }) => html(page))

        const res = await app.handle(req('/'))
        expect(await res.text()).toBe(page)
        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

    it('auto return html in-sensitive', async () => {
        const app = new Elysia().use(html()).get('/', () => `<!doCTypE HTML>`)

        const res = await app.handle(req('/'))
        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

    it('inherits header', async () => {
        const app = new Elysia().use(html()).get('/', ({ html, set }) => {
            set.headers.Server = 'Elysia'
            return html(page)
        })

        const res = await app.handle(req('/'))
        expect(res.headers.get('Server')).toBe('Elysia')
        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

    it('inherits header plain response', async () => {
        const app = new Elysia().use(html()).get('/', ({ html, set }) => {
            set.headers.Server = 'Elysia'
            return page
        })

        const res = await app.handle(req('/'))
        expect(res.headers.get('Content-Type')).toBe('text/html')
        expect(res.headers.get('Server')).toBe('Elysia')
    })

    it('inherits header plain response, no @elysia/html', async () => {
        const app = new Elysia().get('/', ({ set }) => {
            set.headers.Server = 'Elysia'
            return page
        })

        const res = await app.handle(req('/'))
        expect(res.headers.get('Server')).toBe('Elysia')
    })
})
