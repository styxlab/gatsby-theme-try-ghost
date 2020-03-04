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
  let { filter, type } = pluginOptions
  //filter = filter || () => false
  type = type || `HtmlRehype`

 if (
    node.internal.mediaType !== `text/html` &&
    !filter(node)
  ) {
    return {}
  }

  console.log(node.slug)

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

  let content = {}

  if (node.file){
    content = await loadNodeContent(node.file)
  } else {
    content = { content: node.html }
  }

  try {
    return transformObject(
        content,
        createNodeId(`${node.id} >>> ${type}`),
        type)
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing HTML in node ${node.id} :\n ${err.message}`
    )
    return {} // eslint
  }
}
