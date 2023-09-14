import { Elysia } from 'elysia'
import { html, Fragment } from '../src/index'

const page = `<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

const jsx = (
    <html lang="en">
        <head hx-a="A">
            <title>Hello World</title>
        </head>
        <body>
            <h1>Hello World</h1>
        </body>
    </html>
)

const app = new Elysia()
    .use(html())
    .get('/', () => page)
    .get('/jsx', () => jsx)
    .get('/html', ({ html }) => html(page))
    .get('/a', () => (
        <>
            <h1>Hello World</h1>
        </>
    ))
    .listen(8080)
