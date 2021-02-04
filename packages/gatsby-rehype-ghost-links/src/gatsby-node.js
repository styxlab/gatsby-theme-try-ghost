const url = require(`url`)
const visit = require(`unist-util-visit`)

module.exports = ({ htmlAst, getNode, getNodesByType }) => {
    const config = getNode(`gatsby-theme-try-ghost-config`)
    const basePath = (config && config.basePath) || `/`

    const settings = getNodesByType(`GhostSettings`)
    const cmsUrl = url.parse(settings[0].url)

    visit(htmlAst, { tagName: `a` }, (node) => {
        const href = url.parse(node.properties && node.properties.href)

        if (href.protocol === cmsUrl.protocol && href.host === cmsUrl.host) {
            node.properties.href = basePath + href.pathname.substring(1)
        }
    })

    return htmlAst
}
