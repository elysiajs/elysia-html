# @kingworldjs/html
A plugin for [kingworld](https://github.com/saltyaom/kingworld) that add support for returning html.

## Installation
```bash
bun add @kingworldjs/html
```

## Example
```typescript
import KingWorld from 'kingworld'
import html from '@kingworldjs/html'

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
```

## API
This plugin detect html string and add `html` method to `Context`.

If your response is start with `<!DOCTYPE` (case in-sensitive), `Content-Type` will be set to `text/html`.

Or if you want to manually return html, simply use newly added `html` function like this:
```typescript
app.get('/html', ({ html }) => html(page))
```
