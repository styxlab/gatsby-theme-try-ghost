const _ = require(`lodash`)
const Promise = require(`bluebird`)
const Rehype = require(`rehype`)
const Remark = require(`remark`)
const visit = require(`unist-util-visit`)
var u = require('unist-builder')

module.exports = (
  {
    type,
    basePath,
    getNode,
    getNodesByType,
    reporter,
    ...rest
  },
  pluginOptions
) => {
  if (type.name !== `GhostPostHtml`) {
    return {}
  }

  return new Promise((resolve, reject) => {
    // Setup rehype.
    let rehype = new Rehype() //.data(`settings`, htmlOptions)
    let remark = new Remark()

    for (let plugin of pluginOptions.plugins) {
      const requiredPlugin = require(plugin.resolve)
      if (_.isFunction(requiredPlugin.setParserPlugins)) {
        for (let parserPlugin of requiredPlugin.setParserPlugins(
          plugin.pluginOptions
        )) {
          if (_.isArray(parserPlugin)) {
            const [parser, options] = parserPlugin
            rehype = rehype.use(parser, options)
          } else {
            rehype = rehype.use(parserPlugin)
          }
        }
      }
    }

    async function getAST(htmlNode) {
        // Use Bluebird's Promise function "each" to run rehype plugins serially.
        await Promise.each(pluginOptions.plugins, plugin => {
          const requiredPlugin = require(plugin.resolve)
          if (_.isFunction(requiredPlugin.mutateSource)) {
            return requiredPlugin.mutateSource(
              {
                htmlNode,
                getNode,
                reporter,
                compiler: {
                  parseString: rehype.parse.bind(rehype),
                  generateHTML: null,
                },
                ...rest,
              },
              plugin.pluginOptions
            )
          } else {
            return Promise.resolve()
          }
        })
        const markdownAST = remark.parse(htmlNode.content)
        console.log(markdownAST)

        var tree = u('root', [
          u('code', '1'),
          u('node', [u('code', '2')]),
          u('void'),
          u('code', '3')
        ])

        console.log(tree)

        visit(markdownAST, `code`, node => {
            console.log("visit")
        })

        await Promise.each(pluginOptions.plugins, plugin => {
          const requiredPlugin = require(plugin.resolve)
          // Allow both exports = function(), and exports.default = function()
          const defaultFunction = _.isFunction(requiredPlugin)
            ? requiredPlugin
            : _.isFunction(requiredPlugin.default)
            ? requiredPlugin.default
            : undefined

          if (defaultFunction) {
            console.log(defaultFunction)
            return defaultFunction(
              {
                markdownAST,
                htmlNode,
                getNode,
                basePath,
                reporter,
                compiler: {
                  parseString: rehype.parse.bind(rehype),
                  generateHTML: null,
                },
                ...rest,
              },
              plugin.pluginOptions
            )
          } else {
            return Promise.resolve()
          }
        })
        return markdownAST
    }

    console.log("ghost2")

    async function getHtmlAst(htmlNode) {
        const htmlAst = await getAST(htmlNode)
        return htmlAst
    }

    return resolve({
      html: {
        type: `String`,
        resolve(htmlNode) {
            return htmlNode.content
        },
      },
      htmlAst: {
        type: `JSON`,
        resolve(htmlNode) {
            return getHtmlAst(htmlNode).then(ast => {
                return ast
            })
        },
      },
    })
  })
}
