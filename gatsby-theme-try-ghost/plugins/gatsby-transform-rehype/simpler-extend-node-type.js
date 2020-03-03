const _ = require(`lodash`)
const Promise = require(`bluebird`)
const unified = require(`unified`)
const parse = require(`rehype-parse`)
const stringify = require(`rehype-stringify`)


const Remark = require(`remark`)
const select = require(`unist-util-select`)
const visit = require(`unist-util-visit`)
const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
const mdastToToc = require(`mdast-util-toc`)
const mdastToString = require(`mdast-util-to-string`)
const remark2retext = require(`remark-retext`)
const stripPosition = require(`unist-util-remove-position`)
const hastReparseRaw = require(`hast-util-raw`)
const prune = require(`underscore.string/prune`)

const {
  getConcatenatedValue,
  cloneTreeUntil,
  findLastTextNode,
} = require(`./hast-processing`)
const codeHandler = require(`./code-handler`)

let pluginsCacheStr = ``
let pathPrefixCacheStr = ``
const astCacheKey = node =>
  `transformer-remark-markdown-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlCacheKey = node =>
  `transformer-remark-markdown-html-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlAstCacheKey = node =>
  `transformer-remark-markdown-html-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`

// ensure only one `/` in new url
const withPathPrefix = (url, pathPrefix) =>
  (pathPrefix + url).replace(/\/\//, `/`)

// TODO: remove this check with next major release
const safeGetCache = ({ getCache, cache }) => id => {
  if (!getCache) {
    return cache
  }
  return getCache(id)
}

/**
 * Map that keeps track of generation of AST to not generate it multiple
 * times in parallel.
 *
 * @type {Map<string,Promise>}
 */
const ASTPromiseMap = new Map()

/**
 * Set of all Markdown node types which, when encountered, generate an extra to
 * separate text.
 *
 * @type {Set<string>}
 */
const SpacehtmlNodeTypesSet = new Set([
  `paragraph`,
  `tableCell`,
  `break`,
])

module.exports = (
  {
    type,
    basePath,
    getNode,
    getNodesByType,
    cache,
    getCache: possibleGetCache,
    reporter,
    ...rest
  },
  pluginOptions
) => {
  if (type.name !== `GhostPostHtml`) {
    return {}
  }
  pluginsCacheStr = pluginOptions.plugins.map(p => p.name).join(``)
  pathPrefixCacheStr = basePath || ``

  const getCache = safeGetCache({ cache, getCache: possibleGetCache })

  return new Promise((resolve, reject) => {
    // Setup Remark.
    const {
      commonmark = true,
      footnotes = true,
      gfm = true,
      pedantic = true,
    } = pluginOptions

    const remarkOptions = {
      commonmark,
      footnotes,
      gfm,
      pedantic,
    }
    let remark = new Remark().data(`settings`, remarkOptions)

    for (let plugin of pluginOptions.plugins) {
      const requiredPlugin = require(plugin.resolve)
      if (_.isFunction(requiredPlugin.setParserPlugins)) {
        for (let parserPlugin of requiredPlugin.setParserPlugins(
          plugin.pluginOptions
        )) {
          if (_.isArray(parserPlugin)) {
            const [parser, options] = parserPlugin
            remark = remark.use(parser, options)
          } else {
            remark = remark.use(parserPlugin)
          }
        }
      }
    }

    async function getAST(htmlNode) {
      const cacheKey = astCacheKey(htmlNode)
      const cachedAST = await cache.get(cacheKey)
      if (cachedAST) {
        return cachedAST
      } else if (ASTPromiseMap.has(cacheKey)) {
        // We are already generating AST, so let's wait for it
        return await ASTPromiseMap.get(cacheKey)
      } else {
        const ASTGenerationPromise = getMarkdownAST(htmlNode)
        ASTGenerationPromise.then(markdownAST => {
          ASTPromiseMap.delete(cacheKey)
          return cache.set(cacheKey, markdownAST)
        }).catch(err => {
          ASTPromiseMap.delete(cacheKey)
          return err
        })
        // Save new AST to cache and return
        // We can now release promise, as we cached result
        ASTPromiseMap.set(cacheKey, ASTGenerationPromise)
        return ASTGenerationPromise
      }
    }

    async function getMarkdownAST(htmlNode) {
      // Use Bluebird's Promise function "each" to run remark plugins serially.
      await Promise.each(pluginOptions.plugins, plugin => {
        const requiredPlugin = require(plugin.resolve)
        if (_.isFunction(requiredPlugin.mutateSource)) {
          return requiredPlugin.mutateSource(
            {
              htmlNode,
              getNode,
              reporter,
              cache: getCache(plugin.name),
              getCache,
              compiler: {
                parseString: remark.parse.bind(remark),
                generateHTML: getHTML,
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

      if (basePath) {
        // Ensure relative links include `pathPrefix`
        visit(markdownAST, [`link`, `definition`], node => {
          if (
            node.url &&
            node.url.startsWith(`/`) &&
            !node.url.startsWith(`//`)
          ) {
            node.url = withPathPrefix(node.url, basePath)
          }
        })
      }

      // Use Bluebird's Promise function "each" to run remark plugins serially.
      await Promise.each(pluginOptions.plugins, plugin => {
        const requiredPlugin = require(plugin.resolve)
        // Allow both exports = function(), and exports.default = function()
        const defaultFunction = _.isFunction(requiredPlugin)
          ? requiredPlugin
          : _.isFunction(requiredPlugin.default)
          ? requiredPlugin.default
          : undefined

        if (defaultFunction) {
          return defaultFunction(
            {
              markdownAST,
              htmlNode,
              getNode,
              basePath,
              reporter,
              cache: getCache(plugin.name),
              getCache,
              compiler: {
                parseString: remark.parse.bind(remark),
                generateHTML: getHTML,
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

    async function getHTMLAst(htmlNode) {
      const cachedAst = await cache.get(htmlAstCacheKey(htmlNode))
      if (cachedAst) {
        return cachedAst
      } else {
        const ast = await getAST(htmlNode)
        const htmlAst = toHAST(ast, {
          allowDangerousHTML: true,
          handlers: { code: codeHandler },
        })

        // Save new HTML AST to cache and return
        cache.set(htmlAstCacheKey(htmlNode), htmlAst)
        return htmlAst
      }
    }

    async function getHTML(htmlNode) {
      const shouldCache = htmlNode && htmlNode.internal
      const cachedHTML =
        shouldCache && (await cache.get(htmlCacheKey(htmlNode)))
      if (cachedHTML) {
        return cachedHTML
      } else {
        const ast = await getHTMLAst(htmlNode)
        // Save new HTML to cache and return
        const html = hastToHTML(ast, {
          allowDangerousHTML: true,
        })

        if (shouldCache) {
          // Save new HTML to cache
          cache.set(htmlCacheKey(htmlNode), html)
        }

        return html
      }
    }

    return resolve({
      html: {
        type: `String`,
        resolve(htmlNode) {
          return getHTML(htmlNode)
        },
      },
      htmlAst: {
        type: `JSON`,
        resolve(htmlNode) {
          return getHTMLAst(htmlNode).then(ast => {
            const strippedAst = stripPosition(_.clone(ast), true)
            return hastReparseRaw(strippedAst)
          })
        },
      },
    })
  })
}
