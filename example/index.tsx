import { Elysia, t } from 'elysia'
import { html } from '../src'

function page({ name }: { name: string }): string {
	return `
		<html lang="en">
			<head>
				<title>Hello ${name}!</title>
			</head>
			<body>
				<h1>Hello ${name}!</h1>
			</body>
		</html>
	`
}

// https://elysiajs.com/plugins/html.html#jsx
function tsxPage({ name }: { name: string }): string {
	return (
		<html lang="en">
			<head>
				<title>Hello ${name}!</title>
			</head>
			<body>
				<h1>Hello ${name}!</h1>
			</body>
		</html>
	)
}

export function createApp() {
	// https://xelysiajs.com/concept/schema.html
	const indexSchema = {
		params: t.Object({
			name: t.String({ default: 'World' })
		})
	}

	return (
		new Elysia()
			// https://elysiajs.com/plugins/html.html#options
			.use(html())
			.get('/', ({ params }) => page(params), indexSchema)
			.get('/tsx', ({ params }) => tsxPage(params), indexSchema)
			.listen(8080)
	)
}
