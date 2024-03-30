import { Elysia } from 'elysia'
import { html } from '../src'

const app = new Elysia()
	.use(html({ autoDetect: true }))
	.get('/a', ({ html, set }) => {
        set.status = 'Forbidden'
        return html(`<h1>Forbidden!</h1>`)
    })
	.compile()

console.log(app.routes[0]?.composed?.toString())

app.handle(new Request('http://localhost:8080/a'))
	.then((x) => x.status)
	.then(console.log)
