/// <reference path="./declaration.ts" />
import { Elysia } from 'elysia'
import sanitize from 'sanitize-html'

import './declaration'

const isHTMLRegex = /<[^>]*>/g
const isHTML = isHTMLRegex.test.bind(isHTMLRegex)

export const html = () =>
    new Elysia({
        name: '@elysiajs/html'
    })
        .derive(({ set }) => ({
            sanitize,
            html(value: string) {
                return new Response(value, {
                    headers: {
                        'content-type': 'text/html; charset=utf8'
                    }
                })
            }
        }))
        .onAfterHandle(({ set }, response) => {
            if (typeof response === 'string' && isHTML(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'

                return new Response(response, set)
            }
        })

export default html
