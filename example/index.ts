import { Elysia } from 'elysia'

import html from '../src/index'

const page = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

const app = new Elysia()
    .use(html)
    .get('/', () => page)
    .get('/html', ({ html }) => html(page))
    .listen(8080)
