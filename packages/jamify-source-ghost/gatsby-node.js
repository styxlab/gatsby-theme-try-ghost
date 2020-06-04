const Promise = require(`bluebird`)
const ContentAPI = require(`./content-api`)
const _ = require(`lodash`)
const cheerio = require(`cheerio`)

const {
    PostNode,
    PageNode,
    TagNode,
    AuthorNode,
    SettingsNode,
    GhostTypes,
    PrefixedGhostTypes,
    generateNodeId,
} = require(`./ghost-nodes`)

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

const removeNodes = (existingNodes, api, deleteNode, getNode, verbose) => {
    const removeFetchOptions = {
        limit: `all`,
        fields: `id`,
    }

    const removePosts = api.posts.browse(removeFetchOptions).then((posts) => {
        removeNode(GhostTypes.post, existingNodes.posts, posts, deleteNode, getNode, verbose)
    })

    const removePages = api.posts.browse(removeFetchOptions).then((pages) => {
        removeNode(GhostTypes.page, existingNodes.pages, pages, deleteNode, getNode, verbose)
    })

    const removeTags = api.tags.browse(removeFetchOptions).then((tags) => {
        removeNode(GhostTypes.tag, existingNodes.tags, tags, deleteNode, getNode, verbose)
    })

    const removeAuthors = api.authors.browse(removeFetchOptions).then((authors) => {
        removeNode(GhostTypes.author, existingNodes.authors, authors, deleteNode, getNode, verbose)
    })

    /**
    * Settings are always present, no need to remove them
    * Only handle updates
    *
    */

    return ([removePosts, removePages, removeTags, removeAuthors])
}

const removeNode = (type, nodes, remoteNodes, deleteNode, getNode, verbose = false) => {
    nodes
        .filter(node => remoteNodes.findIndex(remote => node.id === generateNodeId(type, remote.id)) === -1)
        .forEach((node) => {
            deleteNode({ node: getNode(node.id) })
            verbose && console.info(`removed node with id: ${node.id}`)
        })
}

/**
 * Create Ghost Nodes
 * Uses the Ghost Content API to fetch all posts, pages, tags, authors and settings
 * Creates nodes for each record, so that they are all available to Gatsby
 */
const createGhostNodes = async ({ actions, cache, getNodesByType, getNode, createContentDigest, triggerTime }, configOptions) => {
    const { createNode, touchNode, deleteNode } = actions
    const { ghostConfig, verbose = false, cacheResponse = true } = configOptions
    const api = ContentAPI.configure(ghostConfig)

    verbose && console.info(`Last updated: ${triggerTime}`)

    // Step 1: Keep all existing nodes
    const existingNodes = touchNodes(PrefixedGhostTypes, getNodesByType, touchNode)

    // Step 2: Remove vanished nodes
    const removeItems = removeNodes(existingNodes, api, deleteNode, getNode, verbose)

    // Step 3: Fetch only new and updated posts based on timestamp
    const postAndPageFetchOptions = {
        limit: `all`,
        include: `tags,authors`,
        formats: `html,plaintext`,
        filter: `created_at:>${triggerTime},updated_at:>${triggerTime},published_at:>${triggerTime}`,
    }

    const fetchPosts = api.posts.browse(postAndPageFetchOptions).then((posts) => {
        verbose && console.info(`Fetched Posts: ${posts.length}`)
        posts = transformCodeinjection(posts)
        posts.forEach(post => createNode(PostNode(post)))
    })

    const fetchPages = api.pages.browse(postAndPageFetchOptions).then((pages) => {
        verbose && console.info(`Fetched Pages: ${pages.length}`)
        pages.forEach(page => createNode(PageNode(page)))
    })

    // Step 4: Always fetch tags, authors, seetings (no timestamp available)
    // Only create/update if contentDigest changes
    const tagAndAuthorFetchOptions = {
        limit: `all`,
        include: `count.posts`,
    }
    const fetchTags = api.tags.browse(tagAndAuthorFetchOptions).then((tags) => {
        verbose && console.info(`Fetched Tags: ${tags.length}`)

        tags.forEach(async (tag) => {
            tag.postCount = tag.count.posts
            const existingDigest = cacheResponse && await cache.get(`jamify-source-ghost-tag-${tag.id}`)
            const newDigest = createContentDigest(JSON.stringify(tag))
            if (existingDigest !== newDigest) {
                createNode(TagNode(tag))
                await cache.set(`jamify-source-ghost-tag-${tag.id}`, newDigest)
            } else {
                verbose && console.info(`Tag node has not changed`)
            }
        })
    })

    const fetchAuthors = api.authors.browse(tagAndAuthorFetchOptions).then((authors) => {
        verbose && console.info(`Fetched Authors: ${authors.length}`)

        authors.forEach(async (author) => {
            author.postCount = author.count.posts
            const existingDigest = cacheResponse && await cache.get(`jamify-source-ghost-author-${author.id}`)
            const newDigest = createContentDigest(JSON.stringify(author))
            if (existingDigest !== newDigest) {
                createNode(AuthorNode(author))
                await cache.set(`jamify-source-ghost-author-${author.id}`, createContentDigest(JSON.stringify(author)))
            } else {
                verbose && console.info(`Author node has not changed`)
            }
        })
    })

    const fetchSettings = api.settings.browse().then(async (setting) => {
        const rawSettings = setting
        const existingDigest = cacheResponse && await cache.get(`jamify-source-ghost-settings`)
        const newDigest = createContentDigest(JSON.stringify(rawSettings))

        if (existingDigest !== newDigest) {
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

            createNode(SettingsNode(setting))
            await cache.set(`jamify-source-ghost-settings`, createContentDigest(JSON.stringify(rawSettings)))
        } else {
            verbose && console.info(`Settings node has not changed`)
        }
    })

    return Promise.all([...removeItems, fetchPosts, fetchPages, fetchTags, fetchAuthors, fetchSettings])
}

// Standard way to create nodes
exports.sourceNodes = async ({ actions, cache, getNodesByType, getNode, createContentDigest }, configOptions) => {
    const { cacheResponse = true } = configOptions

    const startTime = new Date(0).toISOString()
    const lastFetched = cacheResponse && await cache.get(`jamify-source-ghost-timestamp`)
    const triggerTime = lastFetched || startTime

    return createGhostNodes({ actions, cache, getNodesByType, getNode, createContentDigest, triggerTime }, configOptions)
}

// Explicitely typed schema
exports.createSchemaCustomization = require(`./create-schema-customization`)

// Set a timestamp at the end of the bootstrap
exports.onPostBootstrap = async ({ cache }) => {
    const now = new Date().toISOString()
    await cache.set(`jamify-source-ghost-timestamp`, now)
}
