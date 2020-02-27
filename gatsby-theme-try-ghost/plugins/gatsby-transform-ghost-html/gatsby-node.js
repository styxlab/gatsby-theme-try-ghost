const _ = require(`lodash`)
const path = require(`path`)

/**
 * Here is the place where Gatsby lets you transform nodes.
 */
exports.sourceNodes = ({ actions, getNodes, getNode, createNodeId, createContentDigest }) => {
    const { createNode, createNodeField } = actions

    let posts = getNodes().filter((node) => node.internal.type === `GhostPost` && node.slug !== 'data-schema')

    //all posts are in posts!
    //now ammend current nodes with new data


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


    //posts.forEach((obj, i) => {
    //    console.log(obj.title)
    //    //transformObject(
    //    //    obj,
    //    //    obj.id ? obj.id : createNodeId(`${obj.id} [${i}] >>> HTML`),
    //    //    getType({ node, object: obj, isArray: true })
    //    //)
    //})

}



async function onCreateNode({ node, actions, getNodes, createNodeId, createContentDigest }, pluginOptions) {
    const { createNode, createParentChildLink } = actions

   //let posts = getNodes().filter((node) => node.internal.type === `GhostPost` && node.slug !== 'data-schema')
   //if (!posts) return
//
   // //console.log(posts.map((node) => node.title))
   // console.log(node.title)

    if (node.internal.type !== `GhostPost` || node.slug === 'data-schema') {
        return
    }

    console.log(node.title)
    return

    //function getType({ node, object, isArray }) {
    //    if (pluginOptions && _.isFunction(pluginOptions.typeName)) {
    //        return pluginOptions.typeName({ node, object, isArray })
    //    } else if (pluginOptions && _.isString(pluginOptions.typeName)) {
    //        return pluginOptions.typeName
    //    } else if (node.internal.type !== `File`) {
    //        return _.upperFirst(_.camelCase(`${node.internal.type} Html`))
    //    } else if (isArray) {
    //        return _.upperFirst(_.camelCase(`${node.name} Html`))
    //    } else {
    //        return _.upperFirst(_.camelCase(`${path.basename(node.dir)} Html`))
    //    }
    //}
    //function transformObject(obj, id, type) {
    //    const yamlNode = {
    //        ...obj,
    //        id,
    //        children: [],
    //        parent: node.id,
    //        internal: {
    //            contentDigest: createContentDigest(obj),
    //            type,
    //        },
    //    }
    //    createNode(yamlNode)
    //    createParentChildLink({ parent: node, child: yamlNode })
    //}
//
    ////const content = await loadNodeContent(node)
    //const content = await getNodes()
    //console.log(content)
    ////const parsedContent = jsYaml.load(content)
    //const parsedContent = content
//
    //if (_.isArray(parsedContent)) {
    //    parsedContent.forEach((obj, i) => {
    //        transformObject(
    //            obj,
    //            obj.id ? obj.id : createNodeId(`${node.id} [${i}] >>> HTML`),
    //            getType({ node, object: obj, isArray: true })
    //        )
    //    })
    //} else if (_.isPlainObject(parsedContent)) {
    //    transformObject(
    //        parsedContent,
    //        parsedContent.id ? parsedContent.id : createNodeId(`${node.id} >>> HTML`),
    //        getType({ node, object: parsedContent, isArray: false })
    //    )
    //}
}

exports.onCreateNode = onCreateNode
