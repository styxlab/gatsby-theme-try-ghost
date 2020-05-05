const _ = require(`lodash`)
const { paginate } = require(`gatsby-awesome-pagination`)
const { resolveUrl } = require(`./src/utils/routing`)
const { createContentDigest } = require(`gatsby-core-utils`)

const gatsbyNodeQuery = require(`./src/utils/gatsbyNodeQuery`)
const infiniteScroll = require(`./src/utils/infinite-scroll`)

exports.createSchemaCustomization = require(`./src/utils/create-schema-customization`)

// Create pages
const createOrdinaryPages = (createPage, pages, basePath, template) => {
    pages.forEach(({ node }) => {
        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
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
const createPostPages = (createPage, posts, basePath, template, tags, collectionPath) => {
    const prevNodes = _.concat(_.drop(posts),[{ node: { slug: `` } }])
    const nextNodes = _.concat([{ node: { slug: `` } }],_.dropRight(posts))

    posts.forEach(({ node }, i) => {
        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, collectionPath, node.slug, node.url)

        //total number of posts for primary tag
        let primaryTagCount = _.find(tags, function (t) {
            return node.primary_tag && t.node.slug === node.primary_tag.slug
        })
        primaryTagCount = primaryTagCount
            && primaryTagCount.node
            && primaryTagCount.node.postCount !== null ? primaryTagCount.node.postCount : 0

        createPage({
            path: url,
            component: template,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
                prev: prevNodes[i].node.slug,
                next: nextNodes[i].node.slug,
                tag: node.primary_tag && node.primary_tag.slug || ``,
                limit: 3,
                skip: 0,
                primaryTagCount: primaryTagCount,
                collectionPath: collectionPath,
            },
        })
    })
}

// Create index page with pagination
const createIndexPage = (createPage, posts, postIds, basePath, template, postsPerPage, collectionPath) => {
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
const createTaxonomyPages = (createPage, taxonomy, postIds, basePath, template, postsPerPage, collectionPath) => {
    taxonomy.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, `/`, node.slug, node.url)

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
                    // Data passed to context is available
                    // in page queries as GraphQL variables.
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
                    collectionPath: collectionPath,
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
    createPostPages(createPage, data.posts, basePath, templates.post, allTags, collectionPath)
    const { indexIds, tagIds, authorIds } = infiniteScroll(data.posts)
    createIndexPage(createPage, data.posts, indexIds, basePath, templates.index, postsPerPage, collectionPath)

    // ToDo: combine collectionPath array!
    createTaxonomyPages(createPage, data.tags, tagIds, basePath, templates.tag, postsPerPage, collectionPath)
    createTaxonomyPages(createPage, data.authors, authorIds, basePath, templates.author, postsPerPage, collectionPath)
}

const getCollection = (data, selector = () => false) => {
    const collection = data.posts.filter(({ node }) => selector(node))
    const postTags = collection.map(({ node }) => node.tags).flat().map(node => node.slug)
    const postAuthors = collection.map(({ node }) => node.authors).flat().map(node => node.slug)

    const collectionTags = data.tags.filter(({ node }) => -1 < postTags.indexOf(node.slug))
    const collectionAuthors = data.authors.filter(({ node }) => -1 < postAuthors.indexOf(node.slug))

    // recalculate postCount (only differs in edge cases)
    collectionTags.forEach(({ node }) => node.postCount = postTags.filter(slug => slug === node.slug).length)
    collectionAuthors.forEach(({ node }) => node.postCount = postAuthors.filter(slug => slug === node.slug).length)

    const residualPosts = data.posts.filter(({ node }) => !selector(node))
    const residualTags = data.tags.filter(({ node }) => -1 === postTags.indexOf(node.slug))
    const residualAuthors = data.authors.filter(({ node }) => -1 === postAuthors.indexOf(node.slug))

    return ({
        primary: {
            posts: collection,
            tags: collectionTags,
            authors: collectionAuthors,
        },
        residual: {
            posts: residualPosts,
            tags: residualTags,
            authors: residualAuthors,
        },
    })
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
    }

    createOrdinaryPages(createPage, data.pages, basePath, templates.page)

    //create pages per collection
    let collectionData = data
    collections.forEach((collection) => {
        collectionData = getCollection(collectionData, collection.selector)
        createCollection(createPage, basePath, collectionData.primary, templates, data.tags, postsPerPage, collection.path)
        collectionData = collectionData.residual
    })
    createCollection(createPage, basePath, collectionData , templates, data.tags, postsPerPage)
}

// Plugins can access basePath with GraphQL query
exports.sourceNodes = ({ actions: { createTypes, createNode } }, { routes = {} }) => {
    const { basePath = `/` } = routes

    createTypes(`
        type GhostConfig implements Node {
            basePath: String!
        }
    `)

    const ghostConfig = {
        basePath: resolveUrl(basePath),
    }

    createNode({
        ...ghostConfig,
        id: `gatsby-theme-try-ghost-config`,
        parent: null,
        children: [],
        internal: {
            type: `ghostConfig`,
            contentDigest: createContentDigest(ghostConfig),
            content: JSON.stringify(ghostConfig),
            description: `Ghost Config`,
        },
    })
}
