/* Fragment are not yet possible in gatsby-node.js */
/* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/issues/12155 */

const gatsbyNodeQuery = `{
    allGhostPost(sort: { order: DESC, fields: [published_at] }) {
        edges {
            node {
                # Main fields
                id
                title
                slug
                url
                featured
                feature_image
                excerpt
                custom_excerpt
                visibility

                # Dates formatted
                created_at_pretty: created_at(formatString: "D MMM YYYY")
                published_at_pretty: published_at(formatString: "D MMM YYYY")
                updated_at_pretty: updated_at(formatString: "D MMM YYYY")

                # Dates unformatted
                created_at
                published_at
                updated_at

                # SEO
                meta_title
                meta_description
                og_description
                og_image
                og_title
                twitter_description
                twitter_image
                twitter_title

                # Authors
                authors {
                    name
                    slug
                    url
                    bio
                    # email
                    profile_image
                    twitter
                    facebook
                    website
                }

                primary_author {
                    name
                    slug
                    url
                    bio
                    # email
                    profile_image
                    twitter
                    facebook
                    website
                }

                # Tags
                primary_tag {
                    name
                    slug
                    url
                    description
                    feature_image
                    meta_description
                    meta_title
                    visibility
                }

                tags {
                    name
                    slug
                    url
                    description
                    feature_image
                    meta_description
                    meta_title
                    visibility
                }

                # Content
                plaintext
                html

                # Additional fields
                url
                canonical_url
                uuid
                page
                codeinjection_foot
                codeinjection_head
                codeinjection_styles
                comment_id
                reading_time

                # Transformed html
                childHtmlRehype {
                    html
                    tableOfContents
                }

                # ImgSharp
                featureImageSharp {
                    base
                    childImageSharp {
                        fluid(maxWidth: 1040) {
                            base64
                            aspectRatio
                            src
                            srcSet
                            sizes
                        }
                    }
                }
            }
        }
    }
    allGhostTag(sort: { order: ASC, fields: name }) {
        edges {
            node {
                slug
                url
                postCount
            }
        }
    }
    allGhostAuthor(sort: { order: ASC, fields: name }) {
        edges {
            node {
                slug
                url
                postCount
            }
        }
    }
    allGhostPage(sort: { order: ASC, fields: published_at }) {
        edges {
            node {
                slug
                url
            }
        }
    }
    site {
        siteMetadata {
            postsPerPage
        }
    }
}`

module.exports = gatsbyNodeQuery
