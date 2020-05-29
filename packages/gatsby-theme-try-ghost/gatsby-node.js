const _ = require(`lodash`)
const { paginate } = require(`gatsby-awesome-pagination`)
const { resolveUrl } = require(`./src/utils/routing`)
const { createContentDigest } = require(`gatsby-core-utils`)

const gatsbyNodeQuery = require(`./src/utils/gatsbyNodeQuery`)
const infiniteScroll = require(`./src/utils/infinite-scroll`)
const ghostConfigDefaults = require(`./src/utils/.ghost.json`)

exports.createSchemaCustomization = require(`./src/utils/create-schema-customization`)

// Create pages
const createOrdinaryPages = (createPage, pages, basePath, template) => {
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
}

// Create post pages
const createPostPages = (createPage, posts, basePath, template, tags, ampPath = ``) => {
    const prevNodes = _.concat([{ node: { slug: `` } }],_.dropRight(posts))
    const nextNodes = _.concat(_.drop(posts),[{ node: { slug: `` } }])

    const collectionPaths = getCollectionPaths(posts.map(({ node }) => node.id), posts)

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
}

// Create index page with pagination
const createIndexPage = (createPage, posts, postIds, basePath, template, postsPerPage, collectionPath = `/`) => {
    const path = resolveUrl(basePath, collectionPath)

    paginate({
        createPage,
        items: posts,
        itemsPerPage: postsPerPage,
        component: template,
        pathPrefix: ({ pageNumber }) => {
            if (pageNumber === 0) {
                return path
            } else {
                return `${path}page`
            }
        },
        context: {
            collectionPath: collectionPath,
            // Infinite Scroll
            postIds: postIds,
            cursor: 0,
        },
    })
}

// Create taxonomy pages (tags, authors)
const createTaxonomyPages = (createPage, taxonomy, postIds, basePath, template, postsPerPage, allPosts) => {
    taxonomy.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // Use url to analyze routing structure coming from Ghost CMS
        const url = resolveUrl(basePath, `/`, node.slug, node.url)
        const collectionPaths = getCollectionPaths(postIds[node.slug], allPosts)

        Array.from({ length: numberOfPages }).forEach((_, i) => {
            const currentPage = i + 1
            const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
            const nextPageNumber =
                currentPage + 1 > numberOfPages ? null : currentPage + 1
            const previousPagePath = prevPageNumber
                ? prevPageNumber === 1
                    ? url
                    : `${url}page/${prevPageNumber}/` : null
            const nextPagePath = nextPageNumber
                ? `${url}page/${nextPageNumber}/`
                : null

            createPage({
                path: i === 0 ? url : `${url}page/${i + 1}/`,
                component: template,
                context: {
                    slug: node.slug,
                    limit: postsPerPage,
                    skip: i * postsPerPage,
                    totalPosts: totalPosts,
                    numberOfPages: numberOfPages,
                    humanPageNumber: currentPage,
                    prevPageNumber: prevPageNumber,
                    nextPageNumber: nextPageNumber,
                    previousPagePath: previousPagePath,
                    nextPagePath: nextPagePath,
                    collectionPaths: collectionPaths,
                    // Infinite Scroll
                    postIds: postIds[node.slug],
                    cursor: 0,
                },
            })
        })
    })
}

/**
 * Collections: Unique group of routes
 *
 */

const createCollection = (createPage, basePath, data, templates, allTags, postsPerPage, collectionPath) => {
    // per collectionPath
    createPostPages(createPage, data.posts, basePath, templates.post, allTags)
    const { indexIds } = infiniteScroll(data.posts)
    createIndexPage(createPage, data.posts, indexIds, basePath, templates.index, postsPerPage, collectionPath)

    // AMP pages
    // createPostPages(createPage, data.posts, basePath, templates.postAmp, allTags, `amp`)
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

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = async ({ graphql, actions }, themeOptions) => {
    const { createPage } = actions
    const { routes } = themeOptions
    const basePath = routes && routes.basePath || `/`
    const collections = routes && routes.collections || []

    /* Fragment are not yet possible here */
    /* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/issues/12155 */

    const result = await graphql(`${gatsbyNodeQuery}`)

    // Check for any errors
    if (result.errors) {
        throw new Error(result.errors)
    }

    // Extract query results
    const postsPerPage = result.data.site.siteMetadata.postsPerPage
    const data = {
        pages: result.data.allGhostPage.edges,
        posts: result.data.allGhostPost.edges,
        tags: result.data.allGhostTag.edges,
        authors: result.data.allGhostAuthor.edges,
    }

    // Load templates
    const templates = {
        page: require.resolve(`./src/templates/page.js`),
        post: require.resolve(`./src/templates/post.js`),
        index: require.resolve(`./src/templates/index.js`),
        tag: require.resolve(`./src/templates/tag.js`),
        author: require.resolve(`./src/templates/author.js`),
        //postAmp: require.resolve(`./src/templates/post.js`),
    }

    createOrdinaryPages(createPage, data.pages, basePath, templates.page)

    // Split index pages by collections
    let collectionData = data
    collections.forEach((collection) => {
        collectionData = getCollection(collectionData, collection.path, collection.selector)
        createCollection(createPage, basePath, collectionData.primary, templates, data.tags, postsPerPage, collection.path)
        collectionData = collectionData.residual
    })
    createCollection(createPage, basePath, collectionData, templates, data.tags, postsPerPage)

    // Taxonomies are not split by collections
    const { tagIds, authorIds } = infiniteScroll(data.posts)
    createTaxonomyPages(createPage, data.tags, tagIds, basePath, templates.tag, postsPerPage, data.posts)
    createTaxonomyPages(createPage, data.authors, authorIds, basePath, templates.author, postsPerPage, data.posts)
}

// Plugins can access basePath and cmsUrl with GraphQL query
exports.sourceNodes = ({ actions: { createTypes, createNode } }, { routes = {}, ghostConfig }) => {
    const { basePath = `/` } = routes
    const ghostConf = _.merge({}, ghostConfigDefaults, ghostConfig)
    const cmsUrl = ghostConf && ghostConf.production && ghostConf.production.apiUrl || null

    createTypes(`
        type GhostConfig implements Node {
            basePath: String!
            cmsUrl: String!
        }
    `)

    const config = {
        basePath: resolveUrl(basePath),
        cmsUrl: cmsUrl.replace(/\/$/, ``),
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
