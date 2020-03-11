const _ = require(`lodash`)
const visit = require(`unist-util-visit`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const getContext = (node, field) => node && node.context && node.context[field]

module.exports = async ({
    htmlAst,
    htmlNode,
    actions: { createNode },
    createNodeId,
    store,
    cache,
    reporter,
}, pluginOptions) => {
    const featureImage = getContext(htmlNode, `feature_image`)
    const url = getContext(htmlNode, `url`)
    const slug = getContext(htmlNode, `slug`)

    if (!featureImage) {
        return htmlAst
    }

    //let fileNode
    //try {
    //    fileNode = await createRemoteFileNode({
    //        url: featureImage,
    //        parentNodeId: htmlNode.id, //htmlNode.parent,
    //        createNode,
    //        createNodeId,
    //        cache,
    //        store,
    //    })
    //} catch (e){
    //    reporter.warn(`Remote image failure.`)
    //}

    // if the file was created, attach the new node to the parent node
    //if (fileNode) {
    //    htmlNode.featureImage___NODE = fileNode.id
    //}

    if (!url && slug){
        reporter.warn(`Expected url and slug not defined.`)
        return htmlAst
    }

    function isUrl(s) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        return regexp.test(s)
    }

    const cmsUrl = _.head(_.split(url, slug, 1))
    if (!isUrl(cmsUrl)) {
        return htmlAst
    }

    visit(htmlAst, { tagName: `img` }, (node) => {
        const src = node.properties && node.properties.src
        //console.log(src)
        //if (href && _.startsWith(href, cmsUrl)) {
        //    node.properties.href = _.replace(href, cmsUrl ,`/`)
        //}
    })

    return htmlAst
}
