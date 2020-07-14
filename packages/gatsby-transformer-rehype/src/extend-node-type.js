const _ = require(`lodash`)
const Rehype = require(`rehype`)
const stripPosition = require(`unist-util-remove-position`)
const hastReparseRaw = require(`hast-util-raw`)
const visit = require(`unist-util-visit`)

// ES6 instead of Bluebird's promise.each
Promise.each = async function (arr, fn) {
    for (const item of arr) {
        await fn(item)
    }
}

let pluginsCacheStr = ``
let pathPrefixCacheStr = ``
const astCacheKey = node => `transformer-rehype-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlCacheKey = node => `transformer-rehype-html-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlAstCacheKey = node => `transformer-rehype-html-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`
const tableOfContentsCacheKey = node => `transformer-rehype-html-toc-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`

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

module.exports = ({
    type,
    basePath,
    getNode,
    getNodesByType,
    cache,
    getCache: possibleGetCache,
    reporter,
    ...rest
}, pluginOptions) => {
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
                    return requiredPlugin.mutateSource({ htmlNode, getNode, getNodesByType,
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
                    return defaultFunction(
                        {
                            htmlAst,
                            generateTableOfContents,
                            htmlNode,
                            getNode,
                            getNodesByType,
                            basePath,
                            reporter,
                            cache: getCache(plugin.name),
                            getCache,
                            compiler: {
                                parseString: rehype.parse.bind(rehype),
                                generateHTML: getHtml,
                            }, ...rest,
                        }, plugin.pluginOptions)
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

        function preserveHtmlTags(htmlAst) {
            const tags = node => node.properties && node.properties.htmlTag && node.properties.htmlTag.length > 0

            visit(htmlAst, tags, (node) => {
                // preserve original html tag here
                node.tagName = node.properties.htmlTag

                // do not include these props in html output
                const props = [...node.properties.htmlClearProps, `htmlTag`]
                if (props.length > 1) {
                    props.push(`htmlClearProps`)
                }
                props.forEach(prop => node.properties[prop] = null)
            })
            return htmlAst
        }

        async function getHtml(htmlNode) {
            const cachedHTML = await cache.get(htmlCacheKey(htmlNode))
            if (cachedHTML) {
                return cachedHTML
            } else {
                const htmlAst = await getAst(htmlNode)

                // clone htmlAst so it does not get mutated here
                const html = rehype.stringify(preserveHtmlTags(_.cloneDeep(htmlAst)))

                // Save new HTML to cache
                cache.set(htmlCacheKey(htmlNode), html)
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

        function generateTableOfContents(htmlAst) {
            const tags = [`h1`,`h2`,`h3`,`h4`,`h5`,`h6`]
            const headings = node => tags.includes(node.tagName)

            // recursive walk to visit all children
            const walk = (children, text = ``, depth = 0) => {
                children.forEach((child) => {
                    if (child.type === `text`) {
                        text = text + child.value
                    } else if (child.children && depth < 3) {
                        depth = depth + 1
                        text = walk(child.children, text, depth)
                    }
                })
                return text
            }

            let toc = []
            visit(htmlAst, headings, (node) => {
                const text = walk(node.children)
                if (text.length > 0) {
                    const id = node.properties && node.properties.id || `error-missing-id`
                    const level = node.tagName.substr(1,1)
                    toc.push({ level: level, id: id, heading: text, parentIndex: -1, items: [] })
                }
            })

            // Walk up the list to find matching parent
            const findParent = (toc, parentIndex, level) => {
                while (parentIndex >= 0 && level < toc[parentIndex].level) {
                    parentIndex = toc[parentIndex].parentIndex
                }
                return parentIndex >= 0 ? toc[parentIndex].parentIndex : -1
            }

            // determine parents
            toc.forEach((node, index) => {
                const prev = toc[index > 0 ? index - 1 : 0]
                node.parentIndex = node.level > prev.level ? node.parentIndex = index - 1 : prev.parentIndex
                node.parentIndex = node.level < prev.level ? findParent(toc, node.parentIndex, node.level) : node.parentIndex
            })

            // add children to their parent
            toc.forEach(node => node.parentIndex >= 0 && toc[node.parentIndex].items.push(node))

            // make final tree
            let tocTree = toc.filter(({ parentIndex }) => parentIndex === -1)

            // remove unneeded properties
            const removeProps = ({ id, heading, items }) => ((items && items.length) > 0 ?
                { id, heading, items: items.map(item => removeProps(item)) } : { id, heading })
            tocTree = tocTree.map(node => removeProps(node))

            return tocTree
        }

        async function getTableOfContents(htmlNode, htmlAst) {
            const cachedToc = await cache.get(tableOfContentsCacheKey(htmlNode))

            if (cachedToc) {
                return cachedToc
            } else {
                const tocTree = generateTableOfContents(htmlAst)
                cache.set(tableOfContentsCacheKey(htmlNode), tocTree)
                return tocTree
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
            tableOfContents: {
                type: `JSON`,
                resolve(htmlNode) {
                    return getHtmlAst(htmlNode)
                        .then(ast => getTableOfContents(htmlNode, ast))
                },
            },
        })
    })
}
