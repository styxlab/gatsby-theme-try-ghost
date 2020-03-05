const _ = require(`lodash`)

const pluginDefaults = { filter: () => false, type: `HtmlRehype` }

module.exports = async function onCreateNode({ node, actions,
    loadNodeContent, createNodeId, reporter, createContentDigest }, pluginOptions) {
    const { createNode, createParentChildLink } = actions
    const { filter, type } = _.merge({}, pluginDefaults, pluginOptions)

    if (node.internal.mediaType !== `text/html` && !filter(node)) {
        return {}
    }

    function transformObject(data, id, type) {
        const { content, ...obj } = data
        const htmlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            internal: {
                content: content,
                type: type,
            },
        }
        htmlNode.internal.contentDigest = createContentDigest(htmlNode)
        createNode(htmlNode)
        createParentChildLink({ parent: node, child: htmlNode })
    }

    const data = {}
    if (node.internal.type === `File`){
        data.content = await loadNodeContent(node)
        data.fileAbsolutePath = node.absolutePath
    } else {
        data.content = node.html
    }

    try {
        return transformObject(data, createNodeId(`${node.id} >>> ${type}`), type)
    } catch (err) {
        reporter.panicOnBuild(`Error processing HTML ${node.absolutePath ?
            `file ${node.absolutePath}` : `in node ${node.id}` }:\n ${err.message}`)
        return {}
    }
}
