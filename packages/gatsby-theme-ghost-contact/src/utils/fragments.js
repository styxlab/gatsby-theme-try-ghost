import { graphql } from 'gatsby'

/**
* These so called fragments are the fields we query on each template.
* A fragment make queries a bit more reuseable, so instead of typing and
* remembering every possible field, you can just use
*   ...GhostPostFields
* for example to load all post fields into your GraphQL query.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/graphql-reference/#fragments
*
*/

// Used for single pages
export const contactPageFields = graphql`
    fragment ContactPageFields on ContactPage {
        # Main fields
        id
        title
        slug
        html
        url
        featured
        feature_image
        excerpt
        custom_excerpt
        visibility

        # SEO
        meta_title
        meta_description

        # Forms
        form_topics

        # External Service
        serviceConfig {
            url
            contentType
        }

        # ImgSharp
        featureImageSharp {
            base
            childImageSharp {
                fluid(maxWidth: 1040, maxHeight: 250) {
                    ...GatsbyImageSharpFluid_withWebp
                }
            }
        }
    }
`
