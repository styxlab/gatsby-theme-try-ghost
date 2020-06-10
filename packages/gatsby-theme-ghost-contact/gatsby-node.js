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
        type ContactPage implements Node @dontinfer {
            id: String
            title: String
            slug: String
            html: String
            feature_image: String
            featured: Boolean
            visibility: String
            url: String
            excerpt: String
            custom_excerpt: String
            meta_title: String
            meta_description: String
            form_topics: [String!]
            serviceConfig: ServiceConfig
            featureImageSharp: File @link
        }
        type ServiceConfig {
            url: String
            contentType: String
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
            allContactPage {
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
    const pages = result.data.allContactPage.edges

    // Load templates
    const pageTemplate = require.resolve(`./src/template/contact.js`)

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
