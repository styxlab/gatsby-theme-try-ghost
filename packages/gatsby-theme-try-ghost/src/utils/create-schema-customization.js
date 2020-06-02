/**
 * Here is the place where Gatsby creates schema customizations.
 * This is needed to make the secondary_navigation field optional.
 */

const typeDefs = `
    type SiteSiteMetadata {
        overwriteGhostNavigation: [Navigation!]
        navigation: [Navigation!]
    }
`

const createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(typeDefs)
}

module.exports = createSchemaCustomization

