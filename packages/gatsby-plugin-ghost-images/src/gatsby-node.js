const _ = require(`lodash`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const pluginDefaults = {
    lookup: [],
}

exports.onCreateNode = async function ({
    node,
    actions,
    createNodeId,
    reporter,
    cache,
    store,
}, pluginOptions) {
    const { createNode } = actions
    const { lookup } = _.merge({}, pluginDefaults, pluginOptions)

    let imgTags = []
    lookup.map((item) => {
        if (item.type === node.internal.type) {
            imgTags = item.imgTags
        }
    })

    if (imgTags.length === 0) {
        return {}
    }

    console.log(imgTags)

    const promises = imgTags.map(async (img) => {
        const imgUrl = node[img]
        console.log(imgUrl)

        return await createRemoteFileNode({
            url: imgUrl,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            cache,
            store,
        })
    })

    try {
        const fileNodes = await Promise.all(promises)
        fileNodes.map((fileNode, i) => node[`${_.camelCase(imgTags[i])}___NODE`] = fileNode.id)
    } catch (err) {
        reporter.panicOnBuild(`Error processing images ${node.absolutePath ?
            `file ${node.absolutePath}` : `in node ${node.id}` }:\n ${err.message}`)
        return {}
    }

    return {}
}
