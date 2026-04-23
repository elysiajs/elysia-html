import { Elysia } from 'elysia'
import html from '../src'

const app = new Elysia()
	.use(html({ autoDetect: false }))
	.get('/', () => '<div></div>')

const res = await app.handle(new Request('http://localhost/'))

console.log(res.headers.get('Content-Type'))
