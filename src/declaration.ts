// @ts-ignore
const { createElement, Fragment } = require('@kitajs/html')

// @ts-ignore
globalThis.ElysiaJSX = createElement
// @ts-ignore
globalThis.ElysiaJSX.Fragment = Fragment

declare function ElysiaJSX(...params: any[]): string

declare namespace JSX {
    // @ts-ignore
    type Element = string

    // @ts-ignore
    type BaseHTMLTag = Record<string, unknown>

    // @ts-ignore
    type BaseIntrinsicElements = Record<string, HtmlTag>

    interface HtmlTag extends BaseHTMLTag {
        safe?: boolean
        accesskey?: string
        class?: string
        contenteditable?: string
        dir?: string
        hidden?: string | boolean
        id?: string
        role?: string
        lang?: string
        draggable?: string | boolean
        spellcheck?: string | boolean
        style?: string
        tabindex?: string
        title?: string
        translate?: string | boolean
    }

    interface HtmlAnchorTag extends HtmlTag {
        href?: string
        target?: string
        download?: string
        ping?: string
        rel?: string
        media?: string
        hreflang?: string
        type?: string
    }
    interface HtmlAreaTag extends HtmlTag {
        alt?: string
        coords?: string
        shape?: string
        href?: string
        target?: string
        ping?: string
        rel?: string
        media?: string
        hreflang?: string
        type?: string
    }
    interface HtmlAudioTag extends HtmlTag {
        src?: string
        autobuffer?: string
        autoplay?: string
        loop?: string
        controls?: string
    }
    interface BaseTag extends HtmlTag {
        href?: string
        target?: string
    }
    interface HtmlQuoteTag extends HtmlTag {
        cite?: string
    }
    interface HtmlBodyTag extends HtmlTag {}
    interface HtmlButtonTag extends HtmlTag {
        action?: string
        autofocus?: string
        disabled?: string
        enctype?: string
        form?: string
        method?: string
        name?: string
        novalidate?: string | boolean
        target?: string
        type?: string
        value?: string
    }
    interface HtmlDataListTag extends HtmlTag {}
    interface HtmlCanvasTag extends HtmlTag {
        width?: string
        height?: string
    }
    interface HtmlTableColTag extends HtmlTag {
        span?: string
    }
    interface HtmlTableSectionTag extends HtmlTag {}
    interface HtmlTableRowTag extends HtmlTag {}
    interface DataTag extends HtmlTag {
        value?: string
    }
    interface HtmlEmbedTag extends HtmlTag {
        src?: string
        type?: string
        width?: string
        height?: string
        // @ts-ignore
        [anything: string]: string | boolean | undefined
    }
    interface HtmlFieldSetTag extends HtmlTag {
        disabled?: string
        form?: string
        name?: string
    }
    interface HtmlFormTag extends HtmlTag {
        acceptCharset?: string
        action?: string
        autocomplete?: string
        enctype?: string
        method?: string
        name?: string
        novalidate?: string | boolean
        target?: string
    }
    interface HtmlHtmlTag extends HtmlTag {
        manifest?: string
    }
    interface HtmlIFrameTag extends HtmlTag {
        src?: string
        srcdoc?: string
        name?: string
        sandbox?: string
        seamless?: string
        width?: string
        height?: string
    }
    interface HtmlImageTag extends HtmlTag {
        alt?: string
        src?: string
        crossorigin?: string
        usemap?: string
        ismap?: string
        width?: string
        height?: string
    }
    interface HtmlInputTag extends HtmlTag {
        accept?: string
        action?: string
        alt?: string
        autocomplete?: string
        autofocus?: string
        checked?: string | boolean
        disabled?: string | boolean
        enctype?: string
        form?: string
        height?: string
        list?: string
        max?: string
        maxlength?: string
        method?: string
        min?: string
        multiple?: string
        name?: string
        novalidate?: string | boolean
        pattern?: string
        placeholder?: string
        readonly?: string
        required?: string
        size?: string
        src?: string
        step?: string
        target?: string
        type?: string
        value?: string
        width?: string
    }
    interface HtmlModTag extends HtmlTag {
        cite?: string
        datetime?: string | Date
    }
    interface KeygenTag extends HtmlTag {
        autofocus?: string
        challenge?: string
        disabled?: string
        form?: string
        keytype?: string
        name?: string
    }
    interface HtmlLabelTag extends HtmlTag {
        form?: string
        for?: string
    }
    interface HtmlLITag extends HtmlTag {
        value?: string | number
    }
    interface HtmlLinkTag extends HtmlTag {
        href?: string
        crossorigin?: string
        rel?: string
        media?: string
        hreflang?: string
        type?: string
        sizes?: string
        integrity?: string
    }
    interface HtmlMapTag extends HtmlTag {
        name?: string
    }
    interface HtmlMetaTag extends HtmlTag {
        name?: string
        httpEquiv?: string
        content?: string
        charset?: string
    }
    interface HtmlMeterTag extends HtmlTag {
        value?: string | number
        min?: string | number
        max?: string | number
        low?: string | number
        high?: string | number
        optimum?: string | number
    }
    interface HtmlObjectTag extends HtmlTag {
        data?: string
        type?: string
        name?: string
        usemap?: string
        form?: string
        width?: string
        height?: string
    }
    interface HtmlOListTag extends HtmlTag {
        reversed?: string
        start?: string | number
    }
    interface HtmlOptgroupTag extends HtmlTag {
        disabled?: string
        label?: string
    }
    interface HtmlOptionTag extends HtmlTag {
        disabled?: string
        label?: string
        selected?: string
        value?: string
    }
    interface HtmlOutputTag extends HtmlTag {
        for?: string
        form?: string
        name?: string
    }
    interface HtmlParamTag extends HtmlTag {
        name?: string
        value?: string
    }
    interface HtmlProgressTag extends HtmlTag {
        value?: string | number
        max?: string | number
    }
    interface HtmlCommandTag extends HtmlTag {
        type?: string
        label?: string
        icon?: string
        disabled?: string
        checked?: string
        radiogroup?: string
        default?: string
    }
    interface HtmlLegendTag extends HtmlTag {}
    interface HtmlBrowserButtonTag extends HtmlTag {
        type?: string
    }
    interface HtmlMenuTag extends HtmlTag {
        type?: string
        label?: string
    }
    interface HtmlScriptTag extends HtmlTag {
        src?: string
        type?: string
        charset?: string
        async?: string
        defer?: string
        crossorigin?: string
        integrity?: string
        text?: string
    }
    interface HtmlDetailsTag extends HtmlTag {
        open?: string
    }
    interface HtmlSelectTag extends HtmlTag {
        autofocus?: string
        disabled?: string
        form?: string
        multiple?: string
        name?: string
        required?: string
        size?: string
    }
    interface HtmlSourceTag extends HtmlTag {
        src?: string
        type?: string
        media?: string
    }
    interface HtmlStyleTag extends HtmlTag {
        media?: string
        type?: string
        disabled?: string
        scoped?: string
    }
    interface HtmlTableTag extends HtmlTag {}
    interface HtmlTableDataCellTag extends HtmlTag {
        colspan?: string | number
        rowspan?: string | number
        headers?: string
    }
    interface HtmlTextAreaTag extends HtmlTag {
        autofocus?: string
        cols?: string
        dirname?: string
        disabled?: string
        form?: string
        maxlength?: string
        minlength?: string
        name?: string
        placeholder?: string
        readonly?: string
        required?: string
        rows?: string
        wrap?: string
    }
    interface HtmlTableHeaderCellTag extends HtmlTag {
        colspan?: string | number
        rowspan?: string | number
        headers?: string
        scope?: string
    }
    interface HtmlTimeTag extends HtmlTag {
        datetime?: string | Date
    }
    interface HtmlTrackTag extends HtmlTag {
        default?: string
        kind?: string
        label?: string
        src?: string
        srclang?: string
    }
    interface HtmlVideoTag extends HtmlTag {
        src?: string
        poster?: string
        autobuffer?: string
        autoplay?: string
        loop?: string
        controls?: string
        width?: string
        height?: string
    }

    interface IntrinsicElements extends BaseIntrinsicElements {
        a: HtmlAnchorTag
        abbr: HtmlTag
        address: HtmlTag
        area: HtmlAreaTag
        article: HtmlTag
        aside: HtmlTag
        audio: HtmlAudioTag
        b: HtmlTag
        bb: HtmlBrowserButtonTag
        base: BaseTag
        bdi: HtmlTag
        bdo: HtmlTag
        blockquote: HtmlQuoteTag
        body: HtmlBodyTag
        br: HtmlTag
        button: HtmlButtonTag
        canvas: HtmlCanvasTag
        caption: HtmlTag
        cite: HtmlTag
        code: HtmlTag
        col: HtmlTableColTag
        colgroup: HtmlTableColTag
        commands: HtmlCommandTag
        data: DataTag
        datalist: HtmlDataListTag
        dd: HtmlTag
        del: HtmlModTag
        details: HtmlDetailsTag
        dfn: HtmlTag
        div: HtmlTag
        dl: HtmlTag
        dt: HtmlTag
        em: HtmlTag
        embed: HtmlEmbedTag
        fieldset: HtmlFieldSetTag
        figcaption: HtmlTag
        figure: HtmlTag
        footer: HtmlTag
        form: HtmlFormTag
        h1: HtmlTag
        h2: HtmlTag
        h3: HtmlTag
        h4: HtmlTag
        h5: HtmlTag
        h6: HtmlTag
        head: HtmlTag
        header: HtmlTag
        hr: HtmlTag
        html: HtmlHtmlTag
        i: HtmlTag
        iframe: HtmlIFrameTag
        img: HtmlImageTag
        input: HtmlInputTag
        ins: HtmlModTag
        kbd: HtmlTag
        keygen: KeygenTag
        label: HtmlLabelTag
        legend: HtmlLegendTag
        li: HtmlLITag
        link: HtmlLinkTag
        main: HtmlTag
        map: HtmlMapTag
        mark: HtmlTag
        menu: HtmlMenuTag
        meta: HtmlMetaTag
        meter: HtmlMeterTag
        nav: HtmlTag
        noscript: HtmlTag
        object: HtmlObjectTag
        ol: HtmlOListTag
        optgroup: HtmlOptgroupTag
        option: HtmlOptionTag
        output: HtmlOutputTag
        p: HtmlTag
        param: HtmlParamTag
        pre: HtmlTag
        progress: HtmlProgressTag
        q: HtmlQuoteTag
        rb: HtmlTag
        rp: HtmlTag
        rt: HtmlTag
        rtc: HtmlTag
        ruby: HtmlTag
        s: HtmlTag
        samp: HtmlTag
        script: HtmlScriptTag
        section: HtmlTag
        select: HtmlSelectTag
        small: HtmlTag
        source: HtmlSourceTag
        span: HtmlTag
        strong: HtmlTag
        style: HtmlStyleTag
        sub: HtmlTag
        sup: HtmlTag
        table: HtmlTableTag
        tbody: HtmlTag
        td: HtmlTableDataCellTag
        template: HtmlTag
        textarea: HtmlTextAreaTag
        tfoot: HtmlTableSectionTag
        th: HtmlTableHeaderCellTag
        thead: HtmlTableSectionTag
        time: HtmlTimeTag
        title: HtmlTag
        tr: HtmlTableRowTag
        track: HtmlTrackTag
        u: HtmlTag
        ul: HtmlTag
        var: HtmlTag
        video: HtmlVideoTag
        wbr: HtmlTag
    }

    interface HtmlBodyTag {
        onafterprint?: string
        onbeforeprint?: string
        onbeforeonload?: string
        onblur?: string
        onerror?: string
        onfocus?: string
        onhaschange?: string
        onload?: string
        onmessage?: string
        onoffline?: string
        ononline?: string
        onpagehide?: string
        onpageshow?: string
        onpopstate?: string
        onredo?: string
        onresize?: string
        onstorage?: string
        onundo?: string
        onunload?: string
    }
    interface HtmlTag {
        oncontextmenu?: string
        onkeydown?: string
        onkeypress?: string
        onkeyup?: string
        onclick?: string
        ondblclick?: string
        ondrag?: string
        ondragend?: string
        ondragenter?: string
        ondragleave?: string
        ondragover?: string
        ondragstart?: string
        ondrop?: string
        onmousedown?: string
        onmousemove?: string
        onmouseout?: string
        onmouseover?: string
        onmouseup?: string
        onmousewheel?: string
        onscroll?: string
    }
    interface FormEvents {
        onblur?: string
        onchange?: string
        onfocus?: string
        onformchange?: string
        onforminput?: string
        oninput?: string
        oninvalid?: string
        onselect?: string
        onsubmit?: string
    }
    interface HtmlInputTag extends FormEvents {}
    interface HtmlFieldSetTag extends FormEvents {}
    interface HtmlFormTag extends FormEvents {}
    interface MediaEvents {
        onabort?: string
        oncanplay?: string
        oncanplaythrough?: string
        ondurationchange?: string
        onemptied?: string
        onended?: string
        onerror?: string
        onloadeddata?: string
        onloadedmetadata?: string
        onloadstart?: string
        onpause?: string
        onplay?: string
        onplaying?: string
        onprogress?: string
        onratechange?: string
        onreadystatechange?: string
        onseeked?: string
        onseeking?: string
        onstalled?: string
        onsuspend?: string
        ontimeupdate?: string
        onvolumechange?: string
        onwaiting?: string
    }
    interface HtmlAudioTag extends MediaEvents {}
    interface HtmlEmbedTag extends MediaEvents {}
    interface HtmlImageTag extends MediaEvents {}
    interface HtmlObjectTag extends MediaEvents {}
    interface HtmlVideoTag extends MediaEvents {}
}
