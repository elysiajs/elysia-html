import {
	createElement as h,
	type Children,
	type PropsWithChildren
} from '@kitajs/html'

export const createElement = (
	name: string | Function,
	attrs: PropsWithChildren<any> | null,
	...children: Children[]
) => {
	const { $elysia, ...attr } = attrs ?? {}

	return h(name, attr, ...children)
}
