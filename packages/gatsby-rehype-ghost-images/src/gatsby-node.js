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

    visit(htmlAst, { tagName: `img` }, (node) => {
        const src = node.properties && node.properties.src
        if (src && _.startsWith(src, cmsUrl)) {
            node.properties.src = _.replace(src, cmsUrl , basePath)
        }

        if (node.properties && node.properties.srcSet) {
            for (let index = 0; index < node.properties.srcSet.length; index++) {
                if (node.properties.srcSet[index] && _.startsWith(node.properties.srcSet[index], cmsUrl)) {
                    node.properties.srcSet[index] = _.replace(node.properties.srcSet[index], cmsUrl, basePath);
                }
            }
        }
    })

    return htmlAst
}
