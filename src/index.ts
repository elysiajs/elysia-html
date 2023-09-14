// Adds @kitajs/html's Html globally.
import '@kitajs/html/register'

export * from './html'
export * from './options'
export * from './utils'

// We cannot use `export * as Html` because @kitajs/html uses `export =`
export const Html = require('@kitajs/html') as typeof import('@kitajs/html')
