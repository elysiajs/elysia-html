import KingWorld from 'kingworld'

const html = (app: KingWorld) =>
    app
        .decorate(
            'html',
            (value: string) =>
                new Response(value, {
                    headers: {
                        'content-type': 'text/html'
                    }
                })
        )
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
