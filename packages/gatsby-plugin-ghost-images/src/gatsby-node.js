const _ = require(`lodash`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const ext = `_sharp`

const pluginDefaults = {
    lookup: [],
    exclude: () => false,
    verbose: false,
}

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type GhostPost implements Node {
            featureImageSharp: FeatureImageSharp
        }
        type GhostPage implements Node {
            featureImageSharp: FeatureImageSharp
        }
        type FeatureImageSharp implements Node {
            base: String!
            childImageSharp: ImageSharp!
        }
    `
    createTypes(typeDefs)
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
    const { lookup, exclude, verbose } = _.merge({}, pluginDefaults, pluginOptions)

    // leave if node is excluded by user
    if (exclude(node)) {
        return {}
    }

    const imgNode = lookup.filter(item => item.type === node.internal.type)

    // leave if node type does not match
    if (imgNode.length === 0) {
        return {}
    }

    const allImgTags = imgNode[0].imgTags.filter(item => node[item] !== null)

    // leave if image field is empty
    if (allImgTags.length === 0) {
        return {}
    }

    // remaining image fields
    const promises = allImgTags.map(async (tag) => {
        const imgUrl = node[tag]
        //if (verbose) {
        //    reporter.info(`${node.internal.type}/${tag}/${node.slug}: ${imgUrl}/`)
        //}

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
        fileNodes.map((fileNode, i) => console.log(`${_.camelCase(`${allImgTags[i]}${ext}`)}___NODE / ${fileNode.url} / ${node.slug}`))
        fileNodes.map((fileNode, i) => node[`${_.camelCase(`${allImgTags[i]}${ext}`)}___NODE`] = fileNode.id)
    } catch (err) {
        reporter.panicOnBuild(`Error processing images ${node.absolutePath ?
            `file ${node.absolutePath}` : `in node ${node.id}` }:\n ${err.message}`)
        return {}
    }

    return {}
}
