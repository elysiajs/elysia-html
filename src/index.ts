import { Elysia } from 'elysia'

export const html = () => (app: Elysia) =>
  app
    .derive((context) => ({
      html(value: string) {
        context.set.headers['content-type'] = 'text/html';
        return new Response(value, context.set)
      }
    }))
    .onAfterHandle((context, response) => {
      if (
        typeof response === 'string' &&
        response
          .trimStart()
          .slice(0, 9)
          .toLowerCase()
          .startsWith('<!doctype')
      ) {
        return context.html(response)
      } else if (typeof response === 'string') {
        return new Response(response, context.set)
      } else {
        return response
      }
    })
export default html
