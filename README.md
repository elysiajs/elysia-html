# @elysia/html

[Elysia](https://github.com/elysiajs/elysia) plugin to render HTML and JSX with [Kita Html](https://html.kitajs.org).

## Installation
```bash
bun add @elysia/html @kitajs/html
bun add -d @kitajs/html-cli typescript
```

```jsonc
// tsconfig.json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "@kitajs/html"
	}
}
```

Run `kita-html check` in CI to catch XSS in JSX at compile time.

## Example
```tsx
import { Elysia } from 'elysia'
import { html } from '@elysia/html'
import { Suspense } from '@kitajs/html/suspense'

new Elysia()
	.use(html())
	.get('/', () => (
		<html lang="en">
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	))
	.get('/stream', ({ rid }) => (
		<Suspense rid={rid} fallback={<p>Loading...</p>}>
			<SlowComponent />
		</Suspense>
	))
	.listen(3000)
```

See [documentation](https://elysiajs.com/plugins/html.html) for more details.
