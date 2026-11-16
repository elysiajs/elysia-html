import { Elysia, status, t } from 'elysia'
import { AutoSuspense, Suspense } from '@kitajs/html/suspense'
import { html } from '../src'

async function FakeDatabase({ name }: { name: string }) {
	await new Promise((resolve) => setTimeout(resolve, 1000))
	return <h1 safe>Hello {name}!</h1>
}

function Layout({ name, children }: { name: string; children: JSX.Element }) {
	return (
		<html lang="en">
			<head>
				<title safe>Hello {name}!</title>
			</head>
			<body>{children}</body>
		</html>
	)
}

const query = t.Object({
	name: t.String({ default: 'World' })
})

new Elysia()
	// https://elysiajs.com/plugins/html.html#options
	.use(html({ autoSuspense: true }))
	.get('/', { query }, ({ query }) => (
		<Layout name={query.name}>
			<h1 safe>Hello {query.name}!</h1>
		</Layout>
	))
	// Explicit request ID
	.get('/suspense', { query }, ({ query, rid }) => (
		<Layout name={query.name}>
			<Suspense rid={rid} fallback={<h1>Loading...</h1>}>
				<FakeDatabase name={query.name} />
			</Suspense>
		</Layout>
	))
	// Request ID provided by the autoSuspense option
	.get('/auto', { query }, ({ query }) => (
		<Layout name={query.name}>
			<AutoSuspense fallback={<h1>Loading...</h1>}>
				<FakeDatabase name={query.name} />
			</AutoSuspense>
		</Layout>
	))
	.get('/missing', () => status(404, <h1>Not found</h1>))
	.listen(8080, () => console.log('Listening on http://localhost:8080'))
