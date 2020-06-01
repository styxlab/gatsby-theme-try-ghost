/**
 * Here is the place where Gatsby creates schema customizations.
 * This is needed to make the secondary_navigation field optional.
 */

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
        featureImageSharp: File @link(from: "featureImageSharp___NODE")
    }
    type GhostPost implements Node {
        childHtmlRehype: HtmlRehype @link
        featureImageSharp: File @link(from: "featureImageSharp___NODE")
    }
    type allGhostPage implements Node {
        childHtmlRehype: HtmlRehype @link
        featureImageSharp: File @link(from: "featureImageSharp___NODE")
    }
    type GhostPage implements Node {
        childHtmlRehype: HtmlRehype @link
        featureImageSharp: File @link(from: "featureImageSharp___NODE")
    }
`

const createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(typeDefs)
}

module.exports = createSchemaCustomization
