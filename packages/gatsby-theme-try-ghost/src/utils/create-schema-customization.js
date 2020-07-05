/**
 * Here is the place where Gatsby creates schema customizations.
 */

const typeDefs = `
    type SiteSiteMetadata {
        overwriteGhostNavigation: [Navigation!]
        navigation: [Navigation!]
    }
    type ImageMeta {
        width: Int
        height: Int
    }
`

const createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(typeDefs)
}

module.exports = createSchemaCustomization

