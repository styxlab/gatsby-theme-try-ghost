const _ = require(`lodash`)
const path = require(`path`)

/**
 * Here is the place where Gatsby lets you transform nodes.
 */

async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }, pluginOptions) {
    const { createNode, createParentChildLink } = actions

    if (node.internal.type !== `GhostPost`) {
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
        const yamlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            internal: {
                contentDigest: createContentDigest(obj),
                type,
            },
        }
        createNode(yamlNode)
        createParentChildLink({ parent: node, child: yamlNode })
    }

    const content = await loadNodeContent(node)
    //const parsedContent = jsYaml.load(content)
    const parsedContent = content

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
}

exports.onCreateNode = onCreateNode
