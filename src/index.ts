/// <reference path="./declaration.ts" />
import { Elysia } from 'elysia'
import * as D from 'dompurify'

const sanitize = D.sanitize

import './declaration'

const isHTMLRegex = /<[^>]*>/
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

export declare type Children =
    | number
    | string
    | boolean
    | null
    | undefined
    | Children[]

export declare type PropsWithChildren<T = {}> = { children?: Children } & T

export declare type Component<T = {}> = (
    this: void,
    props: PropsWithChildren<T>
) => JSX.Element

const { Fragment: F } = require('@kitajs/html')

export const Fragment = F as Component

export default html
