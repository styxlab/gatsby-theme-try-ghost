const ContentAPI = require(`./content-api`)
const _ = require(`lodash`)
const cheerio = require(`cheerio`)

const PLUGIN = `gatsby-source-try-ghost`

// Simple logging
const useLog = (reporter, verbose, severity) => (message) => {
    verbose && reporter[severity](message)
}

const {
    GhostNodes,
    GhostTypes,
    PrefixedGhostTypes,
    generateNodeId,
} = require(`./ghost-nodes`)

const asyncFilter = async (arr, predicate) => Promise.all(arr.map(predicate))
    .then(results => arr.filter((_v, index) => results[index]))

const normalizedContentDigest = (node, createContentDigest) => {
    // eslint-disable-next-line camelcase
    const { id, updated_at, tags, authors } = node
    //const normalize = arr => arr.map(element => element.id)

    return createContentDigest(JSON.stringify({ id, updated_at, tags: tags, authors: authors }))
}

const parseCodeinjection = (html) => {
    let $ = null

    try {
        $ = cheerio.load(html, { decodeEntities: false })
    } catch (e) {
        return {}
    }

    /* eslint-disable ghost/ember/no-global-jquery */
    const $parsedStyles = $(`style`)
    const codeInjObj = {}

    $parsedStyles.each((i, style) => {
        if (i === 0) {
            codeInjObj.styles = $(style).html()
        } else {
            codeInjObj.styles += $(style).html()
        }
    })
    /* eslint-enable ghost/ember/no-global-jquery */

    return codeInjObj
}

const transformCodeinjection = (posts) => {
    posts.map((post) => {
        const allCodeinjections = [post.codeinjection_head, post.codeinjection_foot].join(``)

        if (!allCodeinjections) {
            return post
        }

        const headInjection = parseCodeinjection(allCodeinjections)

        if (_.isEmpty(post.codeinjection_styles)) {
            post.codeinjection_styles = headInjection.styles
        } else {
            post.codeinjection_styles += headInjection.styles
        }

        post.codeinjection_styles = _.isNil(post.codeinjection_styles) ? `` : post.codeinjection_styles

        return post
    })

    return posts
}

// touch nodes to ensure they aren't garbage collected
const touchNodes = (types, getNodesByType, touchNode) => {
    const existingPosts = getNodesByType(PrefixedGhostTypes.post)
    const existingPages = getNodesByType(PrefixedGhostTypes.page)
    const existingTags = getNodesByType(PrefixedGhostTypes.tag)
    const existingAuthors = getNodesByType(PrefixedGhostTypes.author)
    const existingSettings = getNodesByType(PrefixedGhostTypes.settings)

    existingPosts.forEach(node => touchNode({ nodeId: node.id }))
    existingPages.forEach(node => touchNode({ nodeId: node.id }))
    existingTags.forEach(node => touchNode({ nodeId: node.id }))
    existingAuthors.forEach(node => touchNode({ nodeId: node.id }))
    existingSettings.forEach(node => touchNode({ nodeId: node.id }))

    return ({
        posts: existingPosts,
        pages: existingPages,
        tags: existingTags,
        authors: existingAuthors,
    })
}

const prefetchTagAndAuthorNodes = (existingNodes, sourceNodeFields, settings) => {
    const { api, log } = settings

    // Fetch full data for tag an authors here,
    // so we do not need to fetch a second time
    const tagAndAuthorFetchOptions = {
        limit: `all`,
        include: `count.posts`,
    }

    const removeTags = api.tags.browse(tagAndAuthorFetchOptions).then((tags) => {
        log(`Fetched Tags: ${tags.length}`)
        const type = GhostTypes.tag
        const typeLower = type.toLowerCase()

        removeNode(type, existingNodes.tags, tags, sourceNodeFields, settings)
        updateTagAndAuthorNode(typeLower, tags, sourceNodeFields, settings)
    })

    const removeAuthors = api.authors.browse(tagAndAuthorFetchOptions).then((authors) => {
        log(`Fetched Authors: ${authors.length}`)
        const type = GhostTypes.author
        const typeLower = type.toLowerCase()

        removeNode(type, existingNodes.authors, authors, sourceNodeFields, settings)
        updateTagAndAuthorNode(typeLower, authors, sourceNodeFields, settings)
    })

    return [removeTags, removeAuthors]
}

const prefetchPostAndPageNodes = (existingNodes, sourceNodeFields, settings) => {
    const { triggerTime } = sourceNodeFields
    const { api, log } = settings

    // Working around Ghost bugs
    // Need to include tags and authors, because page/post timestamps are not updated on changing tags/authors
    const prefetchOptions = {
        limit: `all`,
        include: `tags,authors`,
        // Another Ghost API glitch
        // url must be included as main field, otherwise url is missing in authors and tags!
        fields: `id,updated_at,url`,
    }
    const lastUpdated = new Date(triggerTime)

    const removeOrUpdatePosts = api.posts.browse(prefetchOptions).then(async (posts) => {
        log(`Prefetched Posts: ${posts.length}`)
        const type = GhostTypes.post
        const typeLower = type.toLowerCase()
        removeNode(GhostTypes.post, existingNodes.posts, posts, sourceNodeFields, settings)

        const checkOldPosts = posts.filter(post => lastUpdated >= new Date(post.updated_at))
        const updateNodes = await getNodesForUpdate(typeLower, checkOldPosts, sourceNodeFields, settings)

        // Update old nodes with changes in tag or author
        if (updateNodes.length > 0) {
            log(`Found old ${typeLower}s with changes: ${updateNodes.length}`)
            await updatePostAndPageNode(typeLower, updateNodes, sourceNodeFields, settings, transformCodeinjection)
        }
    })

    const removeOrUpdatePages = api.pages.browse(prefetchOptions).then(async (pages) => {
        log(`Prefetched Pages: ${pages.length}`)
        const type = GhostTypes.page
        const typeLower = type.toLowerCase()
        removeNode(GhostTypes.page, existingNodes.pages, pages, sourceNodeFields, settings)

        const checkOldPages = pages.filter(page => lastUpdated >= new Date(page.updated_at))
        const updateNodes = await getNodesForUpdate(typeLower, checkOldPages, sourceNodeFields, settings)

        // Update old nodes with changes in tag or author
        if (updateNodes.length > 0) {
            log(`Found old ${typeLower}s with changes: ${updateNodes.length}`)
            await updatePostAndPageNode(type.toLowerCase(), updateNodes, sourceNodeFields, settings)
        }
    })

    /**
    * Settings are always present, no need to remove them
    * Only handle updates
    *
    */

    return [removeOrUpdatePosts, removeOrUpdatePages]
}

const removeNode = (type, nodes, remoteNodes, sourceNodeFields, settings) => {
    const { actions, getNode } = sourceNodeFields
    const { log } = settings

    nodes
        .filter(node => remoteNodes.findIndex(remote => node.id === generateNodeId(type, remote.id)) === -1)
        .forEach((node) => {
            actions.deleteNode({ node: getNode(node.id) })
            log(`Removed node with id: ${node.id}`)
        })
}

const updateTagAndAuthorNode = async (type, nodes, sourceNodeFields, settings) => {
    const { actions, cache, createContentDigest } = sourceNodeFields
    const { createNode } = actions
    const { log, cacheResponse } = settings

    await nodes.forEach(async (node) => {
        node.postCount = node.count.posts
        const newDigest = createContentDigest(JSON.stringify(node))
        const existingDigest = cacheResponse && await cache.get(`${PLUGIN}-${type}-${node.id}`)
        if (existingDigest !== newDigest) {
            createNode(GhostNodes[type](node))
            await cache.set(`${PLUGIN}-${type}-${node.id}`, newDigest)
            log(`Updated ${type} ${node.slug}`)
        } else {
            log(`Preserved ${type} ${node.slug}`)
        }
    })
}

const getNodesForUpdate = async (type, nodes, sourceNodeFields, settings) => {
    const { cache, createContentDigest } = sourceNodeFields
    const { cacheResponse } = settings

    // always update nodes, if cacheResponse is disabled
    if (cacheResponse === false) {
        return nodes
    }

    return asyncFilter(nodes, async (node) => {
        const newDigest = normalizedContentDigest(node, createContentDigest)
        const existingDigest = await cache.get(`${PLUGIN}-${type}-${node.id}`)
        return existingDigest !== newDigest
    })
}

const updatePostAndPageNode = async (type, updateNodes, sourceNodeFields, settings, transform = n => n) => {
    const { actions, cache, createContentDigest } = sourceNodeFields
    const { createNode } = actions
    const { api, log } = settings

    const fetchOptions = {
        limit: `all`,
        include: `tags,authors`,
        filter: `id:[${updateNodes.map(node => node.id)}]`,
    }

    // fetch complete data now
    const updateRemote = await api[`${type}s`].browse(fetchOptions)

    log(`${type}s update due to tag/author change: ${updateRemote.length}`)

    // only needed for post type
    const transformed = transform(updateRemote)

    transformed.forEach(async (node) => {
        createNode(GhostNodes[type](node))
        const newDigest = normalizedContentDigest(node, createContentDigest)
        await cache.set(`${PLUGIN}-${type}-${node.id}`, newDigest)
        log(`${type}: ${node.slug}, updated_at: ${node.updated_at}`)
    })
}

/**
 * Create Ghost Nodes
 * Uses the Ghost Content API to fetch all posts, pages, tags, authors and settings
 * Creates nodes for each record, so that they are all available to Gatsby
 */
const createGhostNodes = async (sourceNodeFields , configOptions) => {
    const { triggerTime, actions, reporter, cache, createContentDigest, getNodesByType } = sourceNodeFields
    const { createNode, touchNode } = actions
    const { ghostConfig, verbose = false, severity = `info`, cacheResponse = true, fetchPostProcessors } = configOptions
    const api = ContentAPI.configure(ghostConfig)
    const log = useLog(reporter, verbose, severity)
    const settings = { api, log , cacheResponse }

    log(`Last updated: ${triggerTime}`)

    // Step 1: Keep all existing nodes
    const existingNodes = touchNodes(PrefixedGhostTypes, getNodesByType, touchNode)

    // Step 2: Remove vanished tags and authors
    // Update if content digest changes
    const removeOrUpdateTagAndAuthor = prefetchTagAndAuthorNodes(existingNodes, sourceNodeFields, settings)

    // Step 3: Remove vanished posts and pages
    // Check old nodes only, if content digest changes for tags and authors: update
    const removeOrUpdatePostAndPage = prefetchPostAndPageNodes(existingNodes, sourceNodeFields, settings)

    // Step 4: Fetch new and updated posts and pages based on timestamp
    const postAndPageFetchOptions = {
        limit: `all`,
        // Room for improvement: Do not fetch tags and authors with every post
        // Rather establish a link to previously fetched tags and authors
        include: `tags,authors`,
        formats: `html,plaintext`,
        filter: `updated_at:>${triggerTime}`,
    }

    const fetchPosts = api.posts.browse(postAndPageFetchOptions).then((posts) => {
        log(`Fetched Posts: ${posts.length}`)
        posts = transformCodeinjection(posts)
        posts.forEach(async (post) => {
            log(`Post: ${post.slug}, updated_at: ${post.updated_at}`)
            if (fetchPostProcessors && fetchPostProcessors.post) {
                post = fetchPostProcessors.post(post)
            }
            if (post) {
                createNode(GhostNodes.post(post))
                const newDigest = normalizedContentDigest(post, createContentDigest)
                await cache.set(`${PLUGIN}-post-${post.id}`, newDigest)
            }
        })
    })

    const fetchPages = api.pages.browse(postAndPageFetchOptions).then((pages) => {
        log(`Fetched Pages: ${pages.length}`)
        pages.forEach(async (page) => {
            log(`Page: ${page.slug}, updated_at: ${page.updated_at}`)
            if (fetchPostProcessors && fetchPostProcessors.page) {
                page = fetchPostProcessors.page(page)
            }
            if (page) {
                createNode(GhostNodes.page(page))
                const newDigest = normalizedContentDigest(page, createContentDigest)
                await cache.set(`${PLUGIN}-page-${page.id}`, newDigest)
            }
        })
    })

    // Step 5: Always fetch settings (no updated timestamp available)
    // Only update as it is never deleted
    const fetchSettings = api.settings.browse().then(async (setting) => {
        log(`Fetched Settings`)
        if (fetchPostProcessors && fetchPostProcessors.setting) {
            setting = fetchPostProcessors.setting(setting)
        }
        const rawSettings = setting
        const newDigest = createContentDigest(JSON.stringify(rawSettings))
        const existingDigest = cacheResponse && await cache.get(`${PLUGIN}-settings`)

        if (existingDigest !== newDigest) {
            log(`Settings are being updated`)
            const codeinjectionHead = setting.codeinjection_head || setting.ghost_head
            const codeinjectionFoot = setting.codeinjection_foot || setting.ghost_foot
            const allCodeinjections = codeinjectionHead ? codeinjectionHead.concat(codeinjectionFoot) :
                codeinjectionFoot ? codeinjectionFoot : null

            if (allCodeinjections) {
                const parsedCodeinjections = parseCodeinjection(allCodeinjections)

                if (_.isEmpty(setting.codeinjection_styles)) {
                    setting.codeinjection_styles = parsedCodeinjections.styles
                } else {
                    setting.codeinjection_styles += parsedCodeinjections.styles
                }
            }

            setting.codeinjection_styles = _.isNil(setting.codeinjection_styles) ? `` : setting.codeinjection_styles

            // The settings object doesn't have an id, prevent Gatsby from getting 'undefined'
            setting.id = 1

            // Remove trailing slashes
            setting.url = setting.url.replace(/\/$/, ``)

            createNode(GhostNodes.settings(setting))
            await cache.set(`${PLUGIN}-settings`, newDigest)
        } else {
            log(`Settings node has not changed`)
        }
    })

    // Now we have a bunch of independent promises
    // Set timestamp after completion
    return Promise.all([...removeOrUpdateTagAndAuthor, ...removeOrUpdatePostAndPage, fetchPosts, fetchPages, fetchSettings]).then(async () => {
        const now = new Date().toISOString()
        await cache.set(`${PLUGIN}-timestamp`, now)
        log(`Timestamp updated to ${now}`)
    })
}

// Standard way to create nodes
exports.sourceNodes = async (sourceNodeFields, configOptions) => {
    const { cacheResponse = true } = configOptions

    const startTime = new Date(0).toISOString()
    const lastFetched = cacheResponse && await sourceNodeFields.cache.get(`${PLUGIN}-timestamp`)
    sourceNodeFields.triggerTime = lastFetched || startTime

    return createGhostNodes(sourceNodeFields, configOptions)
}

// Explicitely typed schema
exports.createSchemaCustomization = require(`./create-schema-customization`)

// Resolvers for linking tags/authors to posts/pages
exports.createResolvers = require(`./create-resolvers`)
