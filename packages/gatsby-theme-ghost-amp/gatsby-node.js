const _ = require(`lodash`)
const { resolveUrl } = require(`gatsby-theme-try-ghost/src/utils/routing`)
const gatsbyNodeQuery = require(`gatsby-theme-try-ghost/src/utils/gatsbyNodeQuery`)

// Create post pages
const createPostPages = (createPage, posts, basePath, tags, template, ampPath = ``) => {
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

/**
 * Collections: Unique group of routes
 *
 */

const createCollection = (createPage, basePath, data, templates, allTags) => {
    createPostPages(createPage, data.posts, basePath, allTags, templates.postAmp, `amp`)
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
    const data = {
        posts: result.data.allGhostPost.edges,
        tags: result.data.allGhostTag.edges,
    }

    // Load templates
    const templates = {
        postAmp: require.resolve(`./src/templates/post.amp.js`),
    }

    // Split index pages by collections
    let collectionData = data
    collections.forEach((collection) => {
        collectionData = getCollection(collectionData, collection.path, collection.selector)
        createCollection(createPage, basePath, collectionData.primary, templates, data.tags)
        collectionData = collectionData.residual
    })
    createCollection(createPage, basePath, collectionData, templates, data.tags)
}
