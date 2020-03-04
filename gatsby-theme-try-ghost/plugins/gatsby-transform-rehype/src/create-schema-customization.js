const typeDefs = `
    type HtmlRehype implements Node {
        html: String
    }
`

module.exports = (nodeApiArgs, pluginOptions = {}) => {
  const { plugins = [] } = pluginOptions

  nodeApiArgs.actions.createTypes(typeDefs)

  // This allows subplugins to use Node APIs bound to `gatsby-transformer-remark`
  // to customize the GraphQL schema. This makes it possible for subplugins to
  // modify types owned by `gatsby-transformer-html`.
  plugins.forEach(plugin => {
    const resolvedPlugin = require(plugin.resolve)
    if (typeof resolvedPlugin.createSchemaCustomization === `function`) {
      resolvedPlugin.createSchemaCustomization(
        nodeApiArgs,
        plugin.pluginOptions
      )
    }
  })
}

module.exports.typeDefs = typeDefs
