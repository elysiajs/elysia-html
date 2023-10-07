export * from './html'
export * from './options'
export * from './utils'

// Adds @kitajs/html's Html globally.
export * from '@kitajs/html/register'
export { Html } from '@kitajs/html'

declare global {
	/** The html factory namespace. */
	var Html: typeof import('./index')
}
