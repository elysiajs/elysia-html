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
function TsxPage({ name }: { name: string }): JSX.Element {
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

function AsyncPage({ name, id }: { id: number; name: string }): JSX.Element {
	return (
		<html lang="en" style={{ backgroundColor: 'black', color: 'white' }}>
			<head>
				<title>Hello {name}!</title>
			</head>
			<body>
				{/* https://github.com/kitajs/html#suspense-component */}
				<Suspense rid={id} fallback={<h1>Loading...</h1>}>
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

const app = new Elysia()
	// https://elysiajs.com/plugins/html.html#options
	.use(html({
		autoDetect: true
	}))
	.get('/', ({ html }) => html('<h1>Hello World!</h1>')
	)
	// .get('/', ({ query }) => page(query), indexSchema)
	// .get('/tsx', ({ query }) => <TsxPage name={query.name} />, indexSchema)
	// .get('/async', ({ query, stream }) => stream(<AsyncPage name={query.name} />, query), indexSchema)
	.listen(8080, () => console.log('Listening on http://localhost:8080'))

app.handle(new Request('http://localhost:8080/'))
	.then((x) => x.text())
	.then(console.log)

console.log(app.routes[0]?.composed?.toString())
