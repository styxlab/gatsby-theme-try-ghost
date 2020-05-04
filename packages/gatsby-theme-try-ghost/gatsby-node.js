const _ = require(`lodash`)
const { paginate } = require(`gatsby-awesome-pagination`)
const { resolveUrl } = require(`./src/utils/routing`)
const fs = require(`fs`)
const { createContentDigest } = require(`gatsby-core-utils`)

const gatsbyNodeQuery = require(`./src/utils/gatsbyNodeQuery`)

/**
 * Here is the place where Gatsby creates schema customizations.
 * This is needed to make the secondary_navigation field optional.
 */
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type Navigation {
            label: String
            url: String
        }
        type allGhostSettings implements Node {
            secondary_navigation: [Navigation!]!
            children: [GhostPostHtml!]!
            coverImageSharp: File @link
        }
        type GhostSettings implements Node {
            secondary_navigation: [Navigation!]!
            children: [GhostPostHtml!]!
            coverImageSharp: File @link
        }
        type allSiteSiteMetadata {
            overwriteGhostNavigation: [Navigation!]
            navigation: [Navigation!]
        }
        type SiteSiteMetadata {
            overwriteGhostNavigation: [Navigation!]
            navigation: [Navigation!]
        }
        type HtmlRehype implements Node {
            html: String
            tableOfContents: JSON
        }
        type allGhostPost implements Node {
            childHtmlRehype: HtmlRehype @link
        }
        type GhostPost implements Node {
            childHtmlRehype: HtmlRehype @link
        }
        type allGhostPage implements Node {
            childHtmlRehype: HtmlRehype @link
        }
        type GhostPage implements Node {
            childHtmlRehype: HtmlRehype @link
        }
    `
    createTypes(typeDefs)
}

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = async ({ graphql, actions }, themeOptions) => {
    const { createPage } = actions
    const { basePath } = themeOptions

    /* Fragment are not yet possible here */
    /* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/issues/12155 */

    const result = await graphql(`${gatsbyNodeQuery}`)

    // Check for any errors
    if (result.errors) {
        throw new Error(result.errors)
    }

    // Extract query results
    const tags = result.data.allGhostTag.edges
    const authors = result.data.allGhostAuthor.edges
    const pages = result.data.allGhostPage.edges
    const posts = result.data.allGhostPost.edges
    const postsPerPage = result.data.site.siteMetadata.postsPerPage

    // Load templates
    const indexTemplate = require.resolve(`./src/templates/index.js`)
    const tagsTemplate = require.resolve(`./src/templates/tag.js`)
    const authorTemplate = require.resolve(`./src/templates/author.js`)
    const pageTemplate = require.resolve(`./src/templates/page.js`)
    const postTemplate = require.resolve(`./src/templates/post.js`)

    /**
    * Infinite Scroll
    *
    * Record all possible postIds that can be shown for each page (unpaginated).
    * Infinite scroll will load more posts in the same order as given here.
    * Uses pageContext to pass this information along.
    *
    * Each post is saved in a JSON file, so it can be fetched upon request.
    *
    */

    const indexIds = []
    const tagIds = {}
    const authorIds = {}

    function saveInfiniteScrollPost(post) {
        const dir = `public/infiniteScroll/`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        const id = post.id
        const filePath = `${dir}${id}.json`
        const dataToSave = JSON.stringify(post)
        fs.writeFile(filePath, dataToSave, err => err && console.log(err))
    }

    posts.forEach(({ node }) => {
        saveInfiniteScrollPost(node)
        indexIds.push(node.id)

        node.tags.map((tag) => {
            if (tagIds[tag.slug] === undefined) {
                tagIds[tag.slug] = []
            }
            tagIds[tag.slug].push(node.id)
        })

        node.authors.map((author) => {
            if (authorIds[author.slug] === undefined) {
                authorIds[author.slug] = []
            }
            authorIds[author.slug].push(node.id)
        })
    })

    // Create tag pages
    tags.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, node.slug, node.url)

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
                component: tagsTemplate,
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
                    // Infinite Scroll
                    postIds: tagIds[node.slug],
                    cursor: 0,
                },
            })
        })
    })

    // Create author pages
    authors.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, node.slug, node.url)

        Array.from({ length: numberOfPages }).forEach((_, i) => {
            const currentPage = i + 1
            const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
            const nextPageNumber =
                currentPage + 1 > numberOfPages ? null : currentPage + 1
            const previousPagePath = prevPageNumber
                ? prevPageNumber === 1
                    ? url
                    : `${url}page/${prevPageNumber}/`
                : null
            const nextPagePath = nextPageNumber
                ? `${url}page/${nextPageNumber}/`
                : null

            createPage({
                path: i === 0 ? url : `${url}page/${i + 1}/`,
                component: authorTemplate,
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
                    // Infinite Scroll
                    postIds: authorIds[node.slug],
                    cursor: 0,
                },
            })
        })
    })

    // Create pages
    pages.forEach(({ node }) => {
        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, node.slug, node.url)

        createPage({
            path: url,
            component: pageTemplate,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
            },
        })
    })

    // Create post pages
    const prevNodes = _.concat(_.drop(posts),[{ node: { slug: `` } }])
    const nextNodes = _.concat([{ node: { slug: `` } }],_.dropRight(posts))

    posts.forEach(({ node }, i) => {
        // Determine the routing structure from
        // Ghost CMS by analyzing the url field
        const url = resolveUrl(basePath, node.slug, node.url)

        //total number of posts for primary tag
        let primaryTagCount = _.find(tags, function (t) {
            return node.primary_tag && t.node.slug === node.primary_tag.slug
        })
        primaryTagCount = primaryTagCount
            && primaryTagCount.node
            && primaryTagCount.node.postCount !== null ? primaryTagCount.node.postCount : 0

        createPage({
            path: url,
            component: postTemplate,
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
            },
        })
    })

    // Create pagination
    paginate({
        createPage,
        items: posts,
        itemsPerPage: postsPerPage,
        component: indexTemplate,
        pathPrefix: ({ pageNumber }) => {
            if (pageNumber === 0) {
                return resolveUrl(basePath)
            } else {
                return `${resolveUrl(basePath)}page`
            }
        },
        // Infinite Scroll
        context: {
            postIds: indexIds,
            cursor: 0,
        },
    })
}

exports.sourceNodes = ({ actions: { createTypes, createNode } }, { basePath = `/` }) => {
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
