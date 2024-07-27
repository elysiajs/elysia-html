import { createElement } from './h'

export * from './html'
export * from './options'
export * from './utils'

export { ErrorBoundary } from '@kitajs/html/error-boundary'

import {escape, escapeHtml, isVoidElement, attributesToString, toKebabCase, isUpper, styleToString, h, contentsToString, contentToString, Fragment} from "@kitajs/html";

export const Html = {
  escape,
  e: escape,
  escapeHtml,
  isVoidElement,
  attributesToString,
  toKebabCase,
  isUpper,
  styleToString,
  createElement: h,
  h,
  contentsToString,
  contentToString,
  Fragment
};

export { createElement }

export { html as default } from './html'
