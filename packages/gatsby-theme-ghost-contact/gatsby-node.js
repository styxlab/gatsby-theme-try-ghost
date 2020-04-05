const _ = require(`lodash`)
const contactConfigDefaults = require(`./src/utils/contactConfigDefaults`)
const serviceConfigDefaults = require(`./src/utils/serviceConfigDefaults`)
const createNodeHelpers = require(`gatsby-node-helpers`).default

const { createNodeFactory } = createNodeHelpers({ typePrefix: `Contact` })
const PageNode = createNodeFactory(`Page`)

/**
 * Here is the place where Gatsby creates schema customizations.
 * This is needed to make the form_topics field optional.
 */
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type allContactPage implements Node {
            form_topics: [String!]
        }
        type ContactPage implements Node {
            form_topics: [String!]
        }
    `
    createTypes(typeDefs)
}

// Standard way to create nodes
exports.sourceNodes = ({ actions }, themeOptions) => {
    const { createNode } = actions
    const serviceConfig = _.merge({}, serviceConfigDefaults, themeOptions.serviceConfig)
    const pageContext = _.merge({}, contactConfigDefaults, themeOptions.pageContext, { serviceConfig: serviceConfig })

    if (!pageContext && pageContext.path && pageContext.path.length > 0) {
        return
    }

    const pages = [pageContext]

    //Create GhostPage nodes
    pages.forEach((node) => {
        const url = _.trim(node.path,`/`)
        node.slug = _.last(_.split(url,`/`))
        node.url = `/${url}/`
        console.log(node)
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
                        path
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
        console.log(node)
        createPage({
            path: node.path,
            component: pageTemplate,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
            },
        })
    })
}
