// Adds @kitajs/html's Html globally.
// @ts-expect-error - When running from a compiled bun version,
// this will fail because /register will be stripped out if not
// used. This is just a workaround to make it work.
import { noop } from '@kitajs/html/register'
try {
	noop()
} catch {}

export * from './html'
export * from './options'
export * from './utils'

export { Html } from '@kitajs/html'
