const _ = require(`lodash`)
const Promise = require(`bluebird`)
const Rehype = require(`rehype`)
const stripPosition = require(`unist-util-remove-position`)
const hastReparseRaw = require(`hast-util-raw`)

let pluginsCacheStr = ``
let pathPrefixCacheStr = ``
const astCacheKey = node => `transformer-rehype-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlCacheKey = node => `transformer-rehype-html-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlAstCacheKey = node => `transformer-rehype-html-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`

// TODO: remove this check with next major release
const safeGetCache = ({ getCache, cache }) => (id) => {
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

const pluginDefaults = { type: `HtmlRehype` }
const rehypeDefaults = { fragment: true, space: `html`, emitParseErrors: false, verbose: false }

module.exports = ({ type, basePath, getNode,
    cache, getCache: possibleGetCache, reporter, ...rest }, pluginOptions) => {
    const { type: nodeType } = _.merge({}, pluginDefaults, pluginOptions)

    if (type.name !== nodeType) {
        return {}
    }

    pluginsCacheStr = pluginOptions.plugins.map(p => p.name).join(``)
    pathPrefixCacheStr = basePath || ``

    const getCache = safeGetCache({ cache, getCache: possibleGetCache })

    return new Promise((resolve) => {
        const { fragment, space, emitParseErrors, verbose } = pluginOptions
        const rehypeOptions = _.merge({}, rehypeDefaults, { fragment, space, emitParseErrors, verbose })

        // Setup rehype.
        let rehype = new Rehype().data(`settings`, rehypeOptions)

        for (let plugin of pluginOptions.plugins) {
            const requiredPlugin = require(plugin.resolve)
            if (_.isFunction(requiredPlugin.setParserPlugins)) {
                for (let parserPlugin of requiredPlugin.setParserPlugins(plugin.pluginOptions)) {
                    if (_.isArray(parserPlugin)) {
                        const [parser, options] = parserPlugin
                        rehype = rehype.use(parser, options)
                    } else {
                        rehype = rehype.use(parserPlugin)
                    }
                }
            }
        }

        async function processHtmlAst(htmlNode) {
            // Use Bluebird's Promise function "each" to run rehype plugins serially.
            await Promise.each(pluginOptions.plugins, (plugin) => {
                const requiredPlugin = require(plugin.resolve)
                if (_.isFunction(requiredPlugin.mutateSource)) {
                    return requiredPlugin.mutateSource({ htmlNode, getNode,
                        reporter, cache: getCache(plugin.name), getCache,
                        compiler: {
                            parseString: rehype.parse.bind(rehype),
                            generateHTML: getHtml,
                        },
                        ...rest }, plugin.pluginOptions)
                } else {
                    return Promise.resolve()
                }
            })
            const htmlAst = rehype.parse(htmlNode.internal.content)
            await Promise.each(pluginOptions.plugins, (plugin) => {
                const requiredPlugin = require(plugin.resolve)
                // Allow both exports = function(), and exports.default = function()
                const defaultFunction = _.isFunction(requiredPlugin)
                    ? requiredPlugin
                    : _.isFunction(requiredPlugin.default) ? requiredPlugin.default : undefined
                if (defaultFunction) {
                    return defaultFunction({ htmlAst, htmlNode, getNode, basePath,
                        reporter, cache: getCache(plugin.name), getCache,
                        compiler: { parseString: rehype.parse.bind(rehype), generateHTML: null },
                        ...rest }, plugin.pluginOptions)
                } else {
                    return Promise.resolve()
                }
            })
            return htmlAst
        }

        async function getAst(htmlNode) {
            const cacheKey = astCacheKey(htmlNode)
            const cachedAST = await cache.get(cacheKey)
            if (cachedAST) {
                return cachedAST
            } else if (ASTPromiseMap.has(cacheKey)) {
                // We are already generating AST, so let's wait for it
                return await ASTPromiseMap.get(cacheKey)
            } else {
                const ASTGenerationPromise = processHtmlAst(htmlNode)
                ASTGenerationPromise.then((htmlAst) => {
                    ASTPromiseMap.delete(cacheKey)
                    return cache.set(cacheKey, htmlAst)
                }).catch((err) => {
                    ASTPromiseMap.delete(cacheKey)
                    return err
                })
                // Save new AST to cache and return
                // We can now release promise, as we cached result
                ASTPromiseMap.set(cacheKey, ASTGenerationPromise)
                return ASTGenerationPromise
            }
        }

        async function getHtml(htmlNode) {
            const shouldCache = htmlNode
            const cachedHTML = shouldCache && (await cache.get(htmlCacheKey(htmlNode)))
            if (cachedHTML) {
                return cachedHTML
            } else {
                const htmlAst = await getAst(htmlNode)
                const html = rehype.stringify(htmlAst)

                if (shouldCache) {
                    // Save new HTML to cache
                    cache.set(htmlCacheKey(htmlNode), html)
                }

                return html
            }
        }

        async function getHtmlAst(htmlNode) {
            const cachedAst = await cache.get(htmlAstCacheKey(htmlNode))
            if (cachedAst) {
                return cachedAst
            } else {
                const htmlAst = await getAst(htmlNode)

                // Save new HTML AST to cache and return
                cache.set(htmlAstCacheKey(htmlNode), htmlAst)
                return htmlAst
            }
        }

        return resolve({
            html: {
                type: `String`,
                resolve(htmlNode) {
                    return getHtml(htmlNode)
                },
            },
            htmlAst: {
                type: `JSON`,
                resolve(htmlNode) {
                    return getHtmlAst(htmlNode).then((ast) => {
                        const strippedAst = stripPosition(_.clone(ast), true)
                        return hastReparseRaw(strippedAst)
                    })
                },
            },
        })
    })
}
