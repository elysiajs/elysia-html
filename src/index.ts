export * from './html';
export * from './options';
export * from './is-html';

// We cannot use `export * as Html` because @kitajs/html uses `export =`
export const Html = require('@kitajs/html') as typeof import('@kitajs/html');
