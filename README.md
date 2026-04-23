# @elysia/html

[Elysia](https://github.com/elysiajs/elysia) plguin to render HTML.

## Installation
```bash
bun add @elysia/html
```

## Example
```tsx
import { Elysia } from 'elysia'
// 'Html' is required for JSX support but not required for string HTML
import { html, Html } from '@elysia/html'

new Elysia()
	.use(html())
	.get(
		'/html',
		() => `
            <html lang='en'>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
	)
	.get('/jsx', () => (
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	))
	.listen(3000)
```

See [documentation](https://elysiajs.com/plugins/html.html) for more details.
