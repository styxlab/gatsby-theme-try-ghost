import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Layout, HeaderPage, PostCard, ImgSharp } from 'gatsby-theme-try-ghost/src/components/common'
import { OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import { ContactForm } from '../components/common'

import { PostClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

const ContactPage = ({ data, location }) => {
    const page = data.contactPage
    const posts = data.allGhostPost.edges
    const featImg = page.featureImageSharp && page.featureImageSharp.publicURL || page.feature_image
    const fluidFeatureImg = page.featureImageSharp && page.featureImageSharp.childImageSharp && page.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: featImg && true })
    const transformedHtml = page.children && page.children[0] && page.children[0].html

    //fill ghostPage in order to reuse meta functions
    const metadata = { ghostPage: page }

    return (
        <React.Fragment>
            <MetaData data={metadata} location={location} type="website"/>
            <OverlayContainer render={ overlay => (
                <Layout overlay={overlay} page={page} tags={page.tags} header={<HeaderPage overlay={overlay}/>}>
                    <div className="inner">
                        <article className={`post-full ${postClass}`}>

                            <header className="post-full-header">
                                <h1 className="post-full-title">{page.title}</h1>

                                { page.custom_excerpt &&
                                    <p className="post-full-custom-excerpt">{page.custom_excerpt}</p>
                                }
                            </header>

                            { featImg &&
                                <figure className="post-full-image">
                                    <ImgSharp fluidClass="kg-card kg-code-card"
                                        fluidImg={fluidFeatureImg} srcImg={featImg} title={page.title} />
                                </figure>
                            }

                            <section className="post-full-content">

                                <div className="post-content">
                                    <ContactForm topics={page.form_topics} serviceConfig={page.serviceConfig} />
                                </div>

                                <div className="post-content"
                                    dangerouslySetInnerHTML={{ __html: transformedHtml || page.html }} />

                            </section>
                        </article>

                        <div className="post-feed">
                            {posts.map(({ node }, i) => (
                                <PostCard key={node.id} post={node} num={i} />
                            ))}
                        </div>

                    </div>
                </Layout>
            )}/>
        </React.Fragment>
    )
}

ContactPage.propTypes = {
    data: PropTypes.shape({
        contactPage: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
        ghostPage: PropTypes.object,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default ContactPage

export const pageQuery = graphql`
  query GhostContactQuery($slug: String!) {
    contactPage(slug: { eq: $slug }) {
        ...ContactPageFields
    }
    allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        limit: 3,
        skip: 0
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`
