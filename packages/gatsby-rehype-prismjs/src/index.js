const _ = require(`lodash`)
const visit = require(`unist-util-visit-parents`)
const parseOptions = require(`./parse-options`)
const loadLanguageExtension = require(`./load-prism-language-extension`)
const highlightCode = require(`./highlight-code`)
const addLineNumbers = require(`./add-line-numbers`)
const commandLine = require(`./command-line`)
const Rehype = require(`rehype`)

const rehypeDefaults = {
    fragment: true,
    space: `html`,
    emitParseErrors: false,
    verbose: false,
}

const pluginDefaults = {
    classPrefix: `language-`,
    inlineCodeMarker: null,
    aliases: {},
    noInlineHighlight: false,
    showLineNumbersGlobal: false,
    languageExtensions: [],
    prompt: { user: `root`, host: `localhost`, global: false },
    escapeEntities: {},
    divClassNames: `kg-card kg-code-card`,
}

module.exports = ({ htmlAst }, pluginOptions) => {
    const {
        classPrefix,
        inlineCodeMarker,
        aliases,
        noInlineHighlight,
        showLineNumbersGlobal,
        languageExtensions,
        prompt,
        escapeEntities,
        divClassNames,
    } = _.merge({}, pluginDefaults, pluginOptions)

    const normalizeLanguage = (lang) => {
        let lower = lang.toLowerCase()
        lower = _.last(_.split(lower,`language-`, 3))
        return aliases[lower] || lower
    }

    const inlineHighlight = (node) => {
        let languageName = `text`
        const child = _.head(node.children)

        if (!(_.isEmpty(node.properties) && child && child.type === languageName)) {
            return
        }

        let value = child.value

        if (inlineCodeMarker) {
            let [language, restOfValue] = value.split(`${inlineCodeMarker}`, 2)
            if (language && restOfValue) {
                languageName = normalizeLanguage(language)
                value = restOfValue
            }
        }

        const className = `${classPrefix}${languageName}`
        const codeHtml = `<code class="${className}">${highlightCode(languageName,
            value, escapeEntities)}</code>`

        const codeAST = rehype.parse(codeHtml)
        visit(codeAST, { tagName: `code` }, (element) => {
            node.properties = element.properties
            node.children = element.children
        })
    }

    let rehype = new Rehype().data(`settings`, rehypeDefaults)

    //Load language extension if defined
    loadLanguageExtension(languageExtensions)

    //always visit once
    visit(htmlAst, { tagName: `code` }, (node, ancestors) => {
        const parent = _.last(ancestors)

        if (parent.tagName !== `pre`) {
            //inline code
            if (!noInlineHighlight) {
                inlineHighlight(node)
            }
            return
        }

        let language = node.properties && node.properties.className
            && _.head(node.properties.className)

        let {
            splitLanguage,
            highlightLines,
            showLineNumbersLocal,
            numberLinesStartAt,
            outputLines,
            promptUserLocal,
            promptHostLocal,
        } = parseOptions(language)

        const showLineNumbers = showLineNumbersLocal || showLineNumbersGlobal
        const promptUser = promptUserLocal || prompt.user
        const promptHost = promptHostLocal || prompt.host
        language = splitLanguage

        // PrismJS's theme styles are targeting pre[class*="language-"]
        // to apply its styles. We do the same here so that users
        // can apply a PrismJS theme and get the expected, ready-to-use
        // outcome without any additional CSS.
        //
        // @see https://github.com/PrismJS/prism/blob/1d5047df37aacc900f8270b1c6215028f6988eb1/themes/prism.css#L49-L54
        let languageName = `text`
        if (language) {
            languageName = normalizeLanguage(language)
        }

        // Allow users to specify a custom class prefix to avoid breaking
        // line highlights if Prism is required by any other code.
        // This supports custom user styling without causing Prism to
        // re-process our already-highlighted markup.
        // @see https://github.com/gatsbyjs/gatsby/issues/1486
        const className = `${classPrefix}${languageName}`

        //get value
        const value = _.head(node.children).value

        let numLinesStyle, numLinesClass, numLinesNumber
        numLinesStyle = numLinesClass = numLinesNumber = ``
        if (showLineNumbers) {
            numLinesStyle = ` style="counter-reset: linenumber ${numberLinesStartAt - 1}"`
            numLinesClass = ` line-numbers`
            numLinesNumber = addLineNumbers(value)
        }

        let highlightClassName = `gatsby-highlight`
        if (highlightLines && highlightLines.length > 0) {
            highlightClassName += ` has-highlighted-lines`
        }

        const useCommandLine =
            [`bash`].includes(languageName) &&
            (prompt.global ||
            (outputLines && outputLines.length > 0) ||
            promptUserLocal || promptHostLocal)

        /* eslint-disable no-multi-spaces */
        const codeHtml = ``
        + `<div class="${divClassNames} ${highlightClassName}" data-language="${languageName}">`
        +   `<pre${numLinesStyle} class="${className}${numLinesClass}">`
        +     `<code class="${className}">`
        +       `${useCommandLine ? commandLine(value, outputLines, promptUser, promptHost) : ``}`
        +       `${highlightCode(languageName, value, escapeEntities, highlightLines, noInlineHighlight)}`
        +     `</code>`
        +     `${numLinesNumber}`
        +   `</pre>`
        + `</div>`

        /* eslint-enable no-multi-spaces */
        const codeAST = rehype.parse(codeHtml)

        visit(codeAST, { tagName: `div` }, (element) => {
            parent.tagName = element.tagName
            parent.properties = element.properties
            parent.children = element.children
        })
    })
}
