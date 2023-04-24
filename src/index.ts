import { Elysia } from 'elysia'

export const html = () => (app: Elysia) =>
    app
        .derive((context) => ({
            html(value: string) {

                //! error: expect(received).toBe(expected)
                //! Expected: "text/html"
                //! Received: "text/html, text/html"

                // context.set.headers['content-type'] = 'text/html';
                // return new Response(value, { headers: context.set.headers });

                return new Response(value, {
                    headers: {
                        ...context.set.headers,
                        'content-type': 'text/html'
                    }
                })
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
            )
                return context.html(response)
        })

export default html
