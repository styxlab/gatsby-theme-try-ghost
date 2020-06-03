const _ = require(`lodash`)
const visit = require(`unist-util-visit`)

module.exports = ({ htmlAst, htmlNode, getNode, getNodesByType, reporter }) => {
    const config = getNode(`gatsby-theme-try-ghost-config`)
    const basePath = config && config.basePath || `/`

    const settings = getNodesByType(`GhostSettings`)
    const cmsUrl = `${settings[0].url}/`

    const url = htmlNode && htmlNode.context && htmlNode.context.url
    const slug = htmlNode && htmlNode.context && htmlNode.context.slug

    if (!url && slug){
        reporter.warn(`Expected url and slug not defined.`)
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
