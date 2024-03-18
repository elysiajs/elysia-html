import { createElement } from './h'

export * from './html'
export * from './options'
export * from './utils'

// Adds @kitajs/html's Html globally.
export * from '@kitajs/html/register'

export { ErrorBoundary } from '@kitajs/html/error-boundary'
export { Suspense } from '@kitajs/html/suspense'

export { Html } from '@kitajs/html'
export { createElement }

Html.createElement = createElement