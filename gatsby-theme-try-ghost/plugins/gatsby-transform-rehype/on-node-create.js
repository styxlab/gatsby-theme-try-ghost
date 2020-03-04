const _ = require(`lodash`)

module.exports = async function onCreateNode(
  {
    node,
    actions,
    loadNodeContent,
    createNodeId,
    reporter,
    createContentDigest,
  },
  pluginOptions,
) {
  const { createNode, createParentChildLink } = actions
  const { filter, type } = _.merge({}, { filter: () => false, type: `HtmlRehype` }, pluginOptions)

 if (
    node.internal.mediaType !== `text/html` &&
    !filter(node)
  ) {
    return {}
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

  let data = {}
  if (node.internal.type === `File`){
    data.content = await loadNodeContent(node)
    data.fileAbsolutePath = node.absolutePath
  } else {
    data = { content: node.html }
  }

  try {
    return transformObject(
        data,
        createNodeId(`${node.id} >>> ${type}`),
        type)
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing HTML in node ${node.id} :\n ${err.message}`
    )
    return {} // eslint
  }
}
