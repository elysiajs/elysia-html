import {
	createElement as h,
	type Children,
	type PropsWithChildren
} from '@kitajs/html'

/**
 * Just to stop TS from complaining about the type.
 *
 * @type {import('@kitajs/html').createElement}
 * @param {any} name
 * @returns {any}
 */
export const createElement = <
	C extends Children[],
	N extends string | Function
>(
	name: N,
	attrs: PropsWithChildren<any> | null,
	...children: C
): Promise<string> extends C[number]
	? Promise<string>
	: N extends () => Promise<string>
	? Promise<string>
	: string => {
	const { $elysia, ...attr } = attrs ?? {}

	const a = h<C, N>(name, attr, ...children)

	return a
}
