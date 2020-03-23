const _ = require(`lodash`)
const contactConfigDefaults = require(`./src/utils/contactConfigDefaults`)
const serviceConfigDefaults = require(`./src/utils/serviceConfigDefaults`)
const createNodeHelpers = require(`gatsby-node-helpers`).default

const { createNodeFactory } = createNodeHelpers({ typePrefix: `Contact` })
const PageNode = createNodeFactory(`Page`)

// Standard way to create nodes
exports.sourceNodes = ({ actions }, themeOptions) => {
    const { createNode } = actions
    const serviceConfig = _.merge({}, serviceConfigDefaults, themeOptions.serviceConfig)
    const pageContext = _.merge({}, contactConfigDefaults, themeOptions.pageContext, { serviceConfig: serviceConfig })

    if (!pageContext && pageContext.slug !== null) {
        return
    }

    const pages = [pageContext]

    //Create GhostPage nodes
    pages.forEach((node) => {
        node.url = `/${node.slug}/`
        createNode(PageNode(node))
    })

    return
}

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const result = await graphql(`
        {
            allContactPage {
                edges {
                    node {
                        slug
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
    const pages = result.data.allContactPage.edges

    // Load templates
    const pageTemplate = require.resolve(`./src/template/contact.js`)

    //Create pages
    pages.forEach(({ node }) => {
        node.url = `/${node.slug}/`
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
