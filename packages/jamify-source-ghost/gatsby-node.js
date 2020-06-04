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
    generateNodeId,
} = require(`./ghost-nodes`)

const parseCodeinjection = (html) => {
    let $ = null

    try {
        $ = cheerio.load(html, { decodeEntities: false })
    } catch (e) {
        return {}
    }

    const $parsedStyles = $(`style`)
    const codeInjObj = {}

    $parsedStyles.each((i, style) => {
        if (i === 0) {
            codeInjObj.styles = $(style).html()
        } else {
            codeInjObj.styles += $(style).html()
        }
    })

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

/**
 * Create Live Ghost Nodes
 * Uses the Ghost Content API to fetch all posts, pages, tags, authors and settings
 * Creates nodes for each record, so that they are all available to Gatsby
 */
const createLiveGhostNodes = ({ actions, getNodesByType, getNode, triggerTime }, configOptions) => {
    const { createNode, touchNode, deleteNode } = actions

    // touch nodes to ensure they aren't garbage collected
    const currentPosts = getNodesByType(GhostTypes.post)
    const currentPages = getNodesByType(GhostTypes.page)
    const currentTags = getNodesByType(GhostTypes.tag)
    const currentAuthors = getNodesByType(GhostTypes.author)
    const currentSettings = getNodesByType(GhostTypes.settings)

    currentPosts.forEach(node => touchNode({ nodeId: node.id }))
    currentPages.forEach(node => touchNode({ nodeId: node.id }))
    currentTags.forEach(node => touchNode({ nodeId: node.id }))
    currentAuthors.forEach(node => touchNode({ nodeId: node.id }))
    currentSettings.forEach(node => touchNode({ nodeId: node.id }))

    const api = ContentAPI.configure(configOptions)

    // deletions
    const removeFetchOptions = {
        limit: `all`,
        fields: `id`,
    }

    const removeItems = (type, localItems, remoteItems) => {
        localItems
            .filter(local => remoteItems.findIndex(remote => local.id === generateNodeId(type, remote.id)) === -1)
            .forEach((local) => {
                deleteNode({ node: getNode(local.id) })
                console.log(`deleted ${local.id}`)
            })
    }

    const removePosts = api.posts.browse(removeFetchOptions).then((posts) => {
        removeItems(GhostTypes.post, currentPosts, posts)
    })

    const removePages = api.posts.browse(removeFetchOptions).then((pages) => {
        removeItems(GhostTypes.page, currentPages, pages)
    })

    const removeTags = api.tags.browse(removeFetchOptions).then((tags) => {
        removeItems(GhostTypes.tags, currentTags, tags)
    })

    const removeAuthors = api.authors.browse(removeFetchOptions).then((authors) => {
        removeItems(GhostTypes.authors, currentAuthors, authors)
    })

    const removeSettings = api.settings.browse(removeFetchOptions).then((settings) => {
        removeItems(GhostTypes.settings, currentSettings, settings)
    })

    console.log(triggerTime)

    // new and updated
    const postAndPageFetchOptions = {
        limit: `all`,
        include: `tags,authors`,
        formats: `html,plaintext`,
        filter: `created_at:>${triggerTime},updated_at:>${triggerTime},published_at:>${triggerTime}`,
    }

    const fetchPosts = api.posts.browse(postAndPageFetchOptions).then((posts) => {
        console.log(`createPosts: ${posts.length}`)
        posts = transformCodeinjection(posts)
        posts.forEach(post => createNode(PostNode(post)))
    })

    const fetchPages = api.pages.browse(postAndPageFetchOptions).then((pages) => {
        console.log(`createPages: ${pages.length}`)
        pages.forEach(page => createNode(PageNode(page)))
    })

    const tagAndAuthorFetchOptions = {
        limit: `all`,
        include: `count.posts`,
    }

    // tags, authors, settings: createNode only, if cached hash has changed
    const fetchTags = api.tags.browse(tagAndAuthorFetchOptions).then((tags) => {
        console.log(`createTags: ${tags.length}`)
        tags.forEach((tag) => {
            tag.postCount = tag.count.posts
            createNode(TagNode(tag))
        })
    })

    const fetchAuthors = api.authors.browse(tagAndAuthorFetchOptions).then((authors) => {
        console.log(`createAuthors: ${authors.length}`)
        authors.forEach((author) => {
            author.postCount = author.count.posts
            createNode(AuthorNode(author))
        })
    })

    const fetchSettings = api.settings.browse().then((setting) => {
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
    })

    return Promise.all([removePosts, removePages, removeTags, removeAuthors, removeSettings, fetchPosts, fetchPages, fetchTags, fetchAuthors, fetchSettings])
}

// Standard way to create nodes
exports.sourceNodes = async ({ actions, cache, getNodesByType, getNode }, configOptions) => {
    const startTime = new Date(0).toISOString()
    const lastFetched = await cache.get(`jamify-source-timestamp`)
    const triggerTime = lastFetched || startTime

    return createLiveGhostNodes({ actions, getNodesByType, getNode, triggerTime }, configOptions)
}

// Explicitely typed
exports.createSchemaCustomization = require(`./create-schema-customization`)

// set a timestamp at the end of the build
exports.onPostBuild = async ({ cache }) => {
    const now = new Date().toISOString()
    await cache.set(`jamify-source-timestamp`, now)
}
