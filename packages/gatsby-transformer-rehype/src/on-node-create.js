const _ = require(`lodash`)

const pluginDefaults = {
    filter: () => false,
    source: n => n.html,
    contextFields: [`url`, `slug`, `feature_image`],
    type: `HtmlRehype`,
}

module.exports = async function onCreateNode({
    node,
    actions,
    loadNodeContent,
    createNodeId,
    reporter,
    createContentDigest,
}, pluginOptions) {
    const { createNode, createParentChildLink } = actions
    const { filter, source, contextFields, type } = _.merge({}, pluginDefaults, pluginOptions)

    if (node.internal.mediaType !== `text/html` && !filter(node)) {
        return {}
    }

    function transformObject(data, id, type) {
        const { content, context, ...obj } = data
        const htmlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            context: context,
            internal: {
                content: content || ``,
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
        data.content = source(node)
        data.context = {}
        contextFields.map((field) => {
            data.context[field] = node[field]
        })
    }

    try {
        return transformObject(data, createNodeId(`${node.id} >>> ${type}`), type)
    } catch (err) {
        reporter.panicOnBuild(`Error processing HTML ${node.absolutePath ?
            `file ${node.absolutePath}` : `in node ${node.id}` }:\n ${err.message}`)
        return {}
    }
}
