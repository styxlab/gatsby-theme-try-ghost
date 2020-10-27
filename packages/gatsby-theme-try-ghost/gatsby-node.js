const _ = require(`lodash`)
const { resolveUrl } = require(`./src/utils/routing`)
const { createContentDigest } = require(`gatsby-core-utils`)

const mediaConfigDefaults = require(`./src/utils/mediaConfigDefaults`)
const gatsbyNodeQuery = require(`./src/utils/gatsbyNodeQuery`)
const paginate = require(`./src/utils/pagination`)
const infiniteScroll = require(`./src/utils/infinite-scroll`)

exports.createSchemaCustomization = require(`./src/utils/create-schema-customization`)
exports.setFieldsOnGraphQLNodeType = require(`./src/utils/extend-node-type`)

// Simple logging
const useLog = (reporter, verbose, severity) => (message) => {
    verbose && reporter[severity](message)
}

// Create pages
const createOrdinaryPages = (createOptions, pages, template) => {
    const { createPage, basePath, log } = createOptions

    pages.forEach(({ node }) => {
        // Use url to analyze routing structure coming from Ghost CMS
        const url = resolveUrl(basePath, `/`, node.slug, node.url)

        createPage({
            path: url,
            component: template,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
            },
        })
    })

    log(`createOrdinaryPages: finished`)
}

// Create post pages
const createPostPages = (createOptions, posts, tags, template, ampPath = ``) => {
    const { createPage, log, basePath } = createOptions
    const prevNodes = _.concat([{ node: { slug: `` } }],_.dropRight(posts))
    const nextNodes = _.concat(_.drop(posts),[{ node: { slug: `` } }])

    const collectionPaths = getCollectionPaths(posts.map(({ node }) => node.id), posts)

    log(`createPostPages: ${posts.length > 0 && posts[0].node.title}`)

    posts.forEach(({ node }, i) => {
        const collectionPath = collectionPaths[node.id]
        const url = resolveUrl(basePath, collectionPath, node.slug, node.url)

        //total number of posts for primary tag
        let primaryTagCount = _.find(tags, function (t) {
            return node.primary_tag && t.node.slug === node.primary_tag.slug
        })
        primaryTagCount = primaryTagCount
            && primaryTagCount.node
            && primaryTagCount.node.postCount !== null ? primaryTagCount.node.postCount : 0

        createPage({
            path: `${url}${ampPath}`,
            component: template,
            context: {
                slug: node.slug,
                prev: prevNodes[i].node.slug,
                next: nextNodes[i].node.slug,
                tag: node.primary_tag && node.primary_tag.slug || ``,
                limit: 3,
                skip: 0,
                primaryTagCount: primaryTagCount,
                collectionPaths: collectionPaths,
            },
        })
    })

    log(`createPostPages: finished`)
}

// Create index page with pagination
const createIndexPage = (createOptions, posts, postIds, template, collectionPath = `/`) => {
    const { createPage, log, basePath, iScrollEnabled, postsPerPage } = createOptions
    const path = resolveUrl(basePath, collectionPath)

    log(`createIndexPage: ${posts.length > 0 && posts[0].node.title}`)

    paginate({
        createPage,
        totalItems: posts.length,
        itemsPerPage: postsPerPage,
        component: template,
        pathPrefix: ({ pageNumber }) => (
            pageNumber === 0 ? path : `${path}page`
        ),
        context: {
            collectionPath: collectionPath,
            // Infinite Scroll
            iScrollEnabled: iScrollEnabled,
            postIds: postIds,
            cursor: 0,
        },
    })

    log(`createIndexPage: finished`)
}

// Create taxonomy pages (tags, authors)
const createTaxonomyPages = (createOptions, taxonomy, postIds, template, allPosts) => {
    const { createPage, log, basePath, iScrollEnabled, postsPerPage } = createOptions

    taxonomy.forEach(({ node }) => {
        // Use url to analyze routing structure coming from Ghost CMS
        const url = resolveUrl(basePath, `/`, node.slug, node.url)
        const collectionPaths = getCollectionPaths(postIds[node.slug], allPosts)

        paginate({
            createPage,
            totalItems: node.postCount,
            itemsPerPage: postsPerPage,
            component: template,
            pathPrefix: ({ pageNumber }) => (
                pageNumber === 0 ? url : `${url}page`
            ),
            context: {
                slug: node.slug,
                collectionPaths: collectionPaths,
                // Infinite Scroll
                iScrollEnabled: iScrollEnabled,
                postIds: postIds[node.slug],
                cursor: 0,
            },
        })
    })

    log(`createTaxonomyPages: finished`)
}

/**
 * Collections: Unique group of routes
 *
 */

const createCollection = (createOptions, data, templates, allTags, collectionPath) => {
    const { iScrollEnabled } = createOptions
    // per collectionPath
    createPostPages(createOptions, data.posts, allTags, templates.post)

    const { indexIds } = infiniteScroll(iScrollEnabled, data.posts)
    createIndexPage(createOptions, data.posts, indexIds, templates.index, collectionPath)
}

const getCollection = (data, collectionPath, selector = () => false) => {
    const collection = data.posts.filter(({ node }) => selector(node))
    collection.forEach(({ node }) => node.collectionPath = collectionPath)

    const residualPosts = data.posts.filter(({ node }) => !selector(node))
    residualPosts.forEach(({ node }) => node.collectionPath = `/`)

    return ({
        primary: {
            posts: collection,
        },
        residual: {
            posts: residualPosts,
        },
    })
}

const getCollectionPaths = (ids, posts) => {
    const paths = {}
    ids.forEach((id) => {
        paths[id] = posts.find(({ node }) => node.id === id).node.collectionPath
    })
    return paths
}

const calcPostCounts = (data) => {
    data.tags.forEach(({ node: tag }) => {
        tag.postCount = data.posts.filter(({ node }) => node.tags.find(t => t.slug === tag.slug) !== undefined).length
    })
    data.authors.forEach(({ node: author }) => {
        author.postCount = data.posts.filter(({ node }) => node.authors.find(a => a.slug === author.slug) !== undefined).length
    })
}

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
    const { createPage } = actions
    const { routes, siteConfig } = themeOptions
    const { verbose, severity, infiniteScroll: iScrollEnabled, excludePostsOrPages = (() => false) } = siteConfig
    const basePath = routes && routes.basePath || `/`
    const collections = routes && routes.collections || []
    const log = useLog(reporter, verbose, severity)

    /* Fragment are not yet possible here */
    /* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/issues/12155 */
    const result = await graphql(`${gatsbyNodeQuery}`)

    // Check for any errors
    if (result.errors) {
        throw new Error(result.errors)
    }
    log(`GraphQL data sucessfully fetched`)

    // Extract query results
    const postsPerPage = result.data.site.siteMetadata.postsPerPage
    const createOptions = { createPage, log, basePath, iScrollEnabled, postsPerPage }

    const data = {
        pages: result.data.allGhostPage.edges,
        posts: result.data.allGhostPost.edges,
        tags: result.data.allGhostTag.edges,
        authors: result.data.allGhostAuthor.edges,
    }

    // exclude posts or pages
    data.posts = data.posts.filter(({ node }) => !excludePostsOrPages(node))
    data.pages = data.pages.filter(({ node }) => !excludePostsOrPages(node))
    calcPostCounts(data)

    log(`createPages: ${data.posts.length > 0 && data.posts[0].node.title}`)

    // Load templates
    const templates = {
        page: require.resolve(`./src/templates/page.js`),
        post: require.resolve(`./src/templates/post.js`),
        index: require.resolve(`./src/templates/index.js`),
        tag: require.resolve(`./src/templates/tag.js`),
        author: require.resolve(`./src/templates/author.js`),
    }

    createOrdinaryPages(createOptions, data.pages, templates.page)

    // Split index pages by collections
    let collectionData = data
    collections.forEach((collection) => {
        collectionData = getCollection(collectionData, collection.path, collection.selector)
        createCollection(createOptions, collectionData.primary, templates, data.tags, collection.path)
        collectionData = collectionData.residual
    })
    createCollection(createOptions, collectionData, templates, data.tags)

    // Taxonomies are not split by collections
    const { tagIds, authorIds } = infiniteScroll(iScrollEnabled, data.posts)

    // Only use tags, authors present in posts (page only tags should not create tag/author pages)
    const postTags = data.tags.filter(({ node }) => (node.postCount > 0 && node.slug.substr(0,5) !== `hash-`))
    const postAuthors = data.authors.filter(({ node }) => node.postCount > 0)

    createTaxonomyPages(createOptions, postTags, tagIds, templates.tag, data.posts)
    createTaxonomyPages(createOptions, postAuthors, authorIds, templates.author, data.posts)

    log(`createPages finished`)
}

// Plugins can access basePath with GraphQL query
exports.sourceNodes = ({ actions: { createTypes, createNode } }, { routes = {}, mediaConfig }) => {
    const { basePath = `/` } = routes
    const { gatsbyImageLoading, gatsbyImageFadeIn } = _.merge({}, mediaConfigDefaults, mediaConfig)

    createTypes(`
        type GhostConfig implements Node @dontinfer {
            basePath: String!
            gatsbyImageLoading: String
            gatsbyImageFadeIn: Boolean
        }
    `)

    const config = {
        basePath: resolveUrl(basePath),
        gatsbyImageLoading,
        gatsbyImageFadeIn,
    }

    createNode({
        ...config,
        id: `gatsby-theme-try-ghost-config`,
        parent: null,
        children: [],
        internal: {
            type: `ghostConfig`,
            contentDigest: createContentDigest(config),
            content: JSON.stringify(config),
            description: `Ghost Config`,
        },
    })
}
