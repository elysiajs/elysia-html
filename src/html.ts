import { Elysia } from 'elysia';
import { isHtml } from './is-html';
import { HtmlOptions } from './options';

export function html(options: HtmlOptions = {}) {
  // Defaults
  options.contentType ??= 'text/html; charset=utf8';
  options.autoDetect ??= true;
  options.isHtml ??= isHtml;
  options.autoDoctype ??= true;

  let instance = new Elysia({ name: '@elysiajs/html' }).derive(() => ({
    html(value: string) {
      if (options.autoDoctype && !isHtml(value)) {
        value = '<!doctype html>' + value;
      }

      return new Response(value, {
        headers: { 'content-type': options.contentType! }
      });
    }
  }));

  if (options.autoDetect) {
    instance = instance.onAfterHandle(({ set }, response) => {
      if (typeof response === 'string' && isHtml(response)) {
        set.headers['content-type'] = options.contentType!;
        return new Response(response, set);
      }
    });
  }

  return instance;
}
