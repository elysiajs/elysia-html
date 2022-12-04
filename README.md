# @elysiajs/html
Plugin for [elysia](https://github.com/elysiajs/elysia) that add support for returning html.

## Installation
```bash
bun add @elysiajs/html
```

## Example
```typescript
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

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
    .use(html())
    .get('/', () => page)
    .get('/html', ({ html }) => html(page))
    .listen(8080)
```

## API
This plugin detects HTML string and adds `html` method to `Context`.

If your response is start with `<!DOCTYPE` (case insensitive), `Content-Type` will be set to `text/html`.

Or if you want to manually return HTML, simply use the newly added `html` function like this:
```typescript
app.get('/html', ({ html }) => html(page))
```
