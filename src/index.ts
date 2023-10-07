try {
	require('@kitajs/html/register')
} catch {}

export * from './html'
export * from './options'
export * from './utils'

export { Html } from '@kitajs/html'

declare global {
	/** The html factory namespace. */
	var Html: typeof import('./index')
}
