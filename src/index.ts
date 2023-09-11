import { Elysia } from 'elysia';

export interface HtmlOptions {
  /**
   * The content-type of the response.
   *
   * @default 'text/html; charset=utf8'
   */
  contentType?: string;

  /**
   * Whether to automatically detect HTML content and set the content-type.
   *
   * @default true
   */
  autoDetect?: boolean;

  /**
   * Whether to automatically add `<!doctype html>` to the response, if not found.
   *
   * @default true
   */
  autoDoctype?: boolean;

  /**
   * The function used to detect if a string is a html or not. Default
   * implementation checks if the strings starts with a doctype or a html tag.
   * Implementation is case insensitive.
   *
   * @default isHtml
   */
  isHtml?: (this: void, value: string) => boolean;
}

export function html(options: HtmlOptions = {}) {
  // Defaults
  options.contentType ??= 'text/html; charset=utf8';
  options.autoDetect ??= true;
  options.isHtml ??= isHtml;
  options.autoDoctype ??= true;

  let instance = new Elysia({ name: '@elysiajs/html' }).derive(() => ({
    html(value: string) {
      if (options.autoDoctype && !isHtml(value)) {
        value = doctype + value;
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

/**
 * The lowercased doctype of HTML.
 */
const doctype = '<!doctype html>';

/**
 * Checks if the strings starts with a doctype or a html tag. Implementation is
 * case insensitive.
 */
export function isHtml(this: void, value: string) {
  // Trims the start and limits the length to the doctype length.
  value = value.trimStart().slice(0, doctype.length).toLowerCase();
  return value == doctype || value.startsWith('<html>');
}
