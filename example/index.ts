import KingWorld from 'kingworld'

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

const app = new KingWorld()
    .use(html)
    .get('/', () => page)
    .get('/html', ({ html }) => html(page))
    .listen(8080)
