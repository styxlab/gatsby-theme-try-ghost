// Used for single posts
const ghostPostFields = `
    # Main fields
    id
    title
    slug
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
    children {
        ... on HtmlRehype {
            html
        }
    }

    # ImgSharp
    featureImageSharp {
        base
        childImageSharp {
            fluid(maxWidth: 1040) {
                ...GatsbyImageSharpFluid
            }
        }
    }
`

module.exports = {
    ghostPostFields: ghostPostFields,
}
