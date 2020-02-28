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
  pluginOptions
) {
  const { createNode, createParentChildLink } = actions

  // We only care about GhostPost content.
  // ToDo: Also support loading html from file
  // ToDo: Make node type configurable -> plugin Options
  if (
    node.internal.type !== `GhostPost` || node.slug === 'data-schema'
  ) {
    return
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
    return htmlNode
  }

  const content

  if (_.isFunction(loadNodeContent)) {
    content = await loadNodeContent(node.file)
  } else {
    content = { html: node.html }
  }

  try {
    return transformObject(
        content,
        createNodeId(`${node.id} >>> HTML`),
        `GhostPostHtml`)
    )
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing HTML in node ${node.id} :\n ${err.message}`
    )
    return {} // eslint
  }
}
