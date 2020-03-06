/* eslint-disable */
const _ = require(`lodash`)
const visit = require(`unist-util-visit`)
const parseOptions = require(`./parse-options`)
const loadLanguageExtension = require(`./load-prism-language-extension`)
const highlightCode = require(`./highlight-code`)
const addLineNumbers = require(`./add-line-numbers`)
const commandLine = require(`./command-line`)
const Rehype = require(`rehype`)

module.exports = (
  { htmlAst },
  {
    classPrefix = `language-`,
    inlineCodeMarker = null,
    aliases = {},
    noInlineHighlight = false,
    showLineNumbers: showLineNumbersGlobal = false,
    languageExtensions = [],
    prompt = {
      user: `root`,
      host: `localhost`,
      global: false,
    },
    escapeEntities = {},
  } = {}
) => {
  const normalizeLanguage = lang => {
    let lower = lang.toLowerCase()
    lower = _.last(_.split(lower,'language-',3))
    return aliases[lower] || lower
  }

  let rehype = new Rehype()

  //Load language extension if defined
  loadLanguageExtension(languageExtensions)

  visit(htmlAst, {tagName: `pre`}, parent => {
    visit(parent, {tagName: `code`}, node => {

    if (parent.type === `temporary`) {
        parent.type = `element`
        return
    }
    //let language = node.meta ? node.lang + node.meta : node.lang
    let language = node.properties && node.properties.className && _.head(node.properties.className)
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
      numLinesStyle = ` style="counter-reset: linenumber ${numberLinesStartAt -
        1}"`
      numLinesClass = ` line-numbers`
      numLinesNumber = addLineNumbers(value)
    }

    let highlightClassName = `gatsby-highlight`
    if (highlightLines && highlightLines.length > 0)
      highlightClassName += ` has-highlighted-lines`

    const useCommandLine =
      [`bash`].includes(languageName) &&
      (prompt.global ||
        (outputLines && outputLines.length > 0) ||
        promptUserLocal ||
        promptHostLocal)

    // prettier-ignore
    //codeHtml = ``
    //+ `<div class="${highlightClassName}" data-language="${languageName}">`
    //+   `<pre${numLinesStyle} class="${className}${numLinesClass}">`
    //+     `<code class="${className}">`
    //+       `${useCommandLine ? commandLine(value, outputLines, promptUser, promptHost) : ``}`
    //+       `${highlightCode(languageName, value, escapeEntities, highlightLines, noInlineHighlight)}`
    //+     `</code>`
    //+     `${numLinesNumber}`
    //+   `</pre>`
    //+ `</div>`
    //
    //codeAST = rehype.parse(codeHtml)
    //visit(codeAST, {tagName: `body`}, body => {
    //    let divElement = _.head(body.children)
    //    parent.tagName = divElement.tagName
    //    parent.properties =  divElement.properties
    //    parent.children = divElement.children
    //    _.find(parent.children, {'tagName': `pre`}).type = `temporary`
    //})

    // prettier-ignore
    codeHtml = ``
    +   `<pre${numLinesStyle} class="${className}${numLinesClass}">`
    +     `<code class="${className}">`
    +       `${useCommandLine ? commandLine(value, outputLines, promptUser, promptHost) : ``}`
    +       `${highlightCode(languageName, value, escapeEntities, highlightLines, noInlineHighlight)}`
    +     `</code>`
    +     `${numLinesNumber}`
    +   `</pre>`

    codeAST = rehype.parse(codeHtml)
    visit(codeAST, {tagName: `body`}, body => {
        let divElement = _.head(body.children)
        parent.tagName = divElement.tagName
        parent.properties =  divElement.properties
        parent.children = divElement.children
        //_.find(parent.children, {'tagName': `pre`}).type = `temporary`
    })

  })
})

  if (!noInlineHighlight) {
    visit(htmlAst, `inlineCode`, node => {
      let languageName = `text`

      if (inlineCodeMarker) {
        let [language, restOfValue] = node.value.split(`${inlineCodeMarker}`, 2)
        if (language && restOfValue) {
          languageName = normalizeLanguage(language)
          node.value = restOfValue
        }
      }

      const className = `${classPrefix}${languageName}`

      node.type = `html`
      node.value = `<code class="${className}">${highlightCode(
        languageName,
        node.value,
        escapeEntities
      )}</code>`
    })
  }
}
