const _ = require(`lodash`)
const visit = require(`unist-util-visit`)

module.exports = ({ htmlAst, htmlNode, getNode, reporter }) => {
    const config = getNode(`gatsby-theme-try-ghost-config`)
    const basePath = config && config.basePath || `/`

    const url = htmlNode && htmlNode.context && htmlNode.context.url
    const slug = htmlNode && htmlNode.context && htmlNode.context.slug

    if (!url && slug){
        reporter.warn(`Expected url and slug not defined.`)
        return htmlAst
    }

    function isUrl(s) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        return regexp.test(s)
    }

    // Regexp to extract the absolute part of the CMS url
    const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/
    const cmsUrl = _.head(url.match(regexp))

    if (!isUrl(cmsUrl)) {
        return htmlAst
    }

    visit(htmlAst, { tagName: `a` }, (node) => {
        const href = node.properties && node.properties.href
        if (href && _.startsWith(href, cmsUrl)) {
            node.properties.href = _.replace(href, cmsUrl , basePath)
        }
    })

    return htmlAst
}
