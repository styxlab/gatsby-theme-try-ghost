const _ = require(`lodash`)
const visit = require(`unist-util-visit`)

module.exports = ({ htmlAst, htmlNode, reporter }, pluginOptions) => {
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

    const cmsUrl = _.head(_.split(url, slug, 1))
    if (!isUrl(cmsUrl)) {
        return htmlAst
    }

    visit(htmlAst, { tagName: `a` }, (node) => {
        const href = node.properties && node.properties.href
        if (href && _.startsWith(href, cmsUrl)) {
            node.properties.href = _.replace(href, cmsUrl ,`/`)
        }
    })

    return htmlAst
}
