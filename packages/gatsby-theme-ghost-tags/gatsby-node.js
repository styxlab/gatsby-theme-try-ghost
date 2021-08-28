const _ = require(`lodash`)
const tagsConfigDefaults = require(`./src/utils/tagsConfigDefaults`)
const createNodeHelpers = require(`gatsby-node-helpers`).default

const { createNodeFactory } = createNodeHelpers({ typePrefix: `Tags` })
const PageNode = createNodeFactory(`Page`)

/**
 * Here is the place where Gatsby creates schema customizations.
 * This is needed to make the form_topics field optional.
 */
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type TagsPage implements Node @dontinfer {
            id: String
            title: String
            slug: String
            url: String
        }
    `
    createTypes(typeDefs)
}

// Standard way to create nodes
exports.sourceNodes = ({ actions }, themeOptions) => {
    const { createNode } = actions
    const pageContext = _.merge({}, tagsConfigDefaults, themeOptions.pageContext)

    if (!pageContext && pageContext.path && pageContext.path.length > 0) {
        return
    }

    const pages = [pageContext]

    //Create GhostPage nodes
    pages.forEach((node, num) => {
        const url = _.trim(node.path,`/`)
        node.url = `/${url}/`
        node.slug = _.last(_.split(url,`/`))
        node.id = num.toString()
        createNode(PageNode(node))
    })

    return
}

/**
 * Here is the place where Gatsby creates the URLs
 */
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const result = await graphql(`
        {
            allTagsPage {
                edges {
                    node {
                        slug
                        url
                    }
                }
            }
        }
    `)

    // Check for any errors
    if (result.errors) {
        throw new Error(result.errors)
    }

    // Extract query results
    const pages = result.data.allTagsPage.edges

    // Load templates
    const pageTemplate = require.resolve(`./src/template/tags.js`)

    //Create pages
    pages.forEach(({ node }) => {
        createPage({
            path: node.url,
            component: pageTemplate,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
            },
        })
    })
}
