const Promise = require(`bluebird`)
const ContentAPI = require(`./content-api`)
const { PostNode, PageNode, TagNode, AuthorNode, SettingsNode } = require(`./ghost-nodes`)
const _ = require(`lodash`)
const cheerio = require(`cheerio`)

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
const createLiveGhostNodes = ({ actions }, configOptions) => {
    const { createNode } = actions

    const api = ContentAPI.configure(configOptions)

    const postAndPageFetchOptions = {
        limit: `all`,
        include: `tags,authors`,
        formats: `html,plaintext`,
    }

    const fetchPosts = api.posts.browse(postAndPageFetchOptions).then((posts) => {
        posts = transformCodeinjection(posts)
        posts.forEach(post => createNode(PostNode(post)))
    })

    const fetchPages = api.pages.browse(postAndPageFetchOptions).then((pages) => {
        pages.forEach(page => createNode(PageNode(page)))
    })

    const tagAndAuthorFetchOptions = {
        limit: `all`,
        include: `count.posts`,
    }

    const fetchTags = api.tags.browse(tagAndAuthorFetchOptions).then((tags) => {
        tags.forEach((tag) => {
            tag.postCount = tag.count.posts
            createNode(TagNode(tag))
        })
    })

    const fetchAuthors = api.authors.browse(tagAndAuthorFetchOptions).then((authors) => {
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

    return Promise.all([fetchPosts, fetchPages, fetchTags, fetchAuthors, fetchSettings])
}

// Standard way to create nodes
exports.sourceNodes = ({ actions }, configOptions) => createLiveGhostNodes({ actions }, configOptions)

// Explicitely typed
exports.createSchemaCustomization = require(`./create-schema-customization`)
