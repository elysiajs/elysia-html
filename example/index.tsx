import { Elysia, t } from 'elysia'
import { html } from '../src'
import { Suspense } from '@kitajs/html/suspense'

function page({ name }: { name: string }): string {
	return `
		<html lang="en" style="background-color: black; color: white;">
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
function tsxPage({ name }: { name: string }): JSX.Element {
	return (
		<html lang="en" style={{ backgroundColor: 'black', color: 'white' }}>
			<head>
				<title>Hello {name}!</title>
			</head>
			<body>
				<h1>Hello {name}!</h1>
			</body>
		</html>
	)
}

async function FakeDatabase({ name }: { name: string }) {
	// Sleeps 1 second
	await new Promise((resolve) => setTimeout(resolve, 1000))
	return <h1>Hello {name}!</h1>
}

function asyncPage(rid: number, { name }: { name: string }): JSX.Element {
	return (
		<html lang="en" style={{ backgroundColor: 'black', color: 'white' }}>
			<head>
				<title>Hello {name}!</title>
			</head>
			<body>
				{/* https://github.com/kitajs/html#suspense-component */}
				<Suspense rid={rid} fallback={<h1>Loading...</h1>}>
					<FakeDatabase name={name} />
				</Suspense>
			</body>
		</html>
	)
}

// https://elysiajs.com/concept/schema.html
const indexSchema = {
	query: t.Object({
		name: t.String({ default: 'World' })
	})
}

new Elysia()
	// https://elysiajs.com/plugins/html.html#options
	.use(html())
	.get('/', ({ query }) => page(query), indexSchema)
	.get('/tsx', ({ query }) => tsxPage(query), indexSchema)
	.get('/async', ({ query, html }) => html(asyncPage, query), indexSchema)
	.listen(8080, () => console.log('Listening on http://localhost:8080'))
