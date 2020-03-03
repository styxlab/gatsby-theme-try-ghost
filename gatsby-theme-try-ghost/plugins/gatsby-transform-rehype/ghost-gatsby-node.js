const _ = require(`lodash`)
const path = require(`path`)

/**
 * Here is the place where Gatsby lets you transform nodes.
 * IMPORTANT: Clear cache (yarn clean) in development!
 */

async function onCreateNode({ node, actions, createNodeId, createContentDigest }, pluginOptions) {
    const { createNode, createParentChildLink } = actions

    if (node.internal.type !== `GhostPost` || node.slug === 'data-schema') {
        return
    }

    function getType({ node, object, isArray }) {
        if (pluginOptions && _.isFunction(pluginOptions.typeName)) {
            return pluginOptions.typeName({ node, object, isArray })
        } else if (pluginOptions && _.isString(pluginOptions.typeName)) {
            return pluginOptions.typeName
        } else if (node.internal.type !== `File`) {
            return _.upperFirst(_.camelCase(`${node.internal.type} Html`))
        } else if (isArray) {
            return _.upperFirst(_.camelCase(`${node.name} Html`))
        } else {
            return _.upperFirst(_.camelCase(`${path.basename(node.dir)} Html`))
        }
    }

    function transformObject(obj, id, type) {
        const htmlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            internal: {
                contentDigest: createContentDigest(obj),
                type,
            },
        }
        createNode(htmlNode)
        createParentChildLink({ parent: node, child: htmlNode })
    }

    //
    //console.log(node.url)

    let contentHtml = node.html

    //only parse if specified in options
    if (pluginOptions.transformLinks){
        const cmsUrl = _.head(_.split(node.url,node.slug, 1))
        contentHtml = _.replace(node.html, cmsUrl ,`/`)
    }

    const parsedContent = { html: contentHtml }

    if (_.isArray(parsedContent)) {
        parsedContent.forEach((obj, i) => {
            transformObject(
                obj,
                obj.id ? obj.id : createNodeId(`${node.id} [${i}] >>> HTML`),
                getType({ node, object: obj, isArray: true })
            )
        })
    } else if (_.isPlainObject(parsedContent)) {
        transformObject(
            parsedContent,
            parsedContent.id ? parsedContent.id : createNodeId(`${node.id} >>> HTML`),
            getType({ node, object: parsedContent, isArray: false })
        )
    }

    return
}

exports.onCreateNode = onCreateNode
