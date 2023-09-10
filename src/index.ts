/// <reference path="./declaration.ts" />
import { Elysia } from 'elysia'
import * as D from 'dompurify'

const sanitize = D.sanitize

const { compile } = require('@kitajs/html')

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

export type { PropsWithChildren } from '@kitajs/html'

export default html
