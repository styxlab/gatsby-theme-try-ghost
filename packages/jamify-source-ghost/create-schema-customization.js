/**
 * Here is the place where Gatsby creates schema customizations.
 */

const typeDefs = `
    type GhostTag implements Node @dontinfer {
        id: String
        name: String
        slug: String
        description: String
        feature_image: String
        visibility: String
        meta_title: String
        meta_description: String
        postCount: Int
        url: String
    }
    type GhostAuthor implements Node @dontinfer {
        id: String
        name: String
        slug: String
        profile_image: String
        cover_image: String
        bio: String
        website: String
        location: String
        facebook: String
        twitter: String
        meta_title: String
        meta_description: String
        postCount: Int
        url: String
    }
    type GhostPost implements Node @dontinfer {
        id: String
        uuid: String
        title: String
        slug: String
        html: String
        comment_id: String
        plaintext: String
        feature_image: String
        featured: Boolean
        visibility: String
        send_email_when_published: Boolean
        created_at: Date @dateformat
        updated_at: Date @dateformat
        published_at: Date @dateformat
        custom_excerpt: String
        codeinjection_head: String
        codeinjection_foot: String
        codeinjection_styles: String
        custom_template: String
        canonical_url: String
        tags: [GhostTag]
        authors: [GhostAuthor]
        primary_author: GhostAuthor
        primary_tag: GhostTag
        url: String
        excerpt: String
        reading_time: Int
        og_image: String
        og_title: String
        og_description: String
        twitter_image: String
        twitter_title: String
        twitter_description: String
        meta_title: String
        meta_description: String
        email_subject: String
        featureImageSharp: File @link
        childHtmlRehype: HtmlRehype @link
    }
    type GhostPage implements Node @dontinfer {
        id: String
        uuid: String
        title: String
        slug: String
        html: String
        comment_id: String
        plaintext: String
        feature_image: String
        featured: Boolean
        visibility: String
        created_at: Date @dateformat
        updated_at: Date @dateformat
        published_at: Date @dateformat
        custom_excerpt: String
        codeinjection_head: String
        codeinjection_foot: String
        codeinjection_styles: String
        custom_template: String
        canonical_url: String
        tags: [GhostTag]
        authors: [GhostAuthor]
        primary_author: GhostAuthor
        primary_tag: GhostTag
        url: String
        excerpt: String
        reading_time: Int
        page: Boolean
        og_image: String
        og_title: String
        og_description: String
        twitter_image: String
        twitter_title: String
        twitter_description: String
        meta_title: String
        meta_description: String
        featureImageSharp: File @link
        childHtmlRehype: HtmlRehype @link
    }
    type GhostSettings implements Node @dontinfer {
        title: String
        description: String
        logo: String
        icon: String
        cover_image: String
        facebook: String
        twitter: String
        lang: String
        timezone: String
        navigation: [Navigation]
        secondary_navigation: [Navigation]
        meta_title: String,
        meta_description: String,
        og_image: String,
        og_title: String,
        og_description: String,
        twitter_image: String,
        twitter_title: String,
        twitter_description: String,
        codeinjection_head: String
        codeinjection_foot: String
        codeinjection_styles: String
        url: String
        coverImageSharp: File @link
    }
    type Navigation {
        label: String
        url: String
    }
    type HtmlRehype implements Node @dontinfer {
        html: String
        htmlAst: JSON
        tableOfContents: JSON
    }
`

const createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(typeDefs)
}

module.exports = createSchemaCustomization
