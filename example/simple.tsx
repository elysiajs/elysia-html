import { Elysia } from 'elysia'
import { html } from '../src'

new Elysia()
	.use(html())
	.get('/0.7', () => <h1>Hello World</h1>)
