import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { HeaderPage, Layout, ImgSharp, RenderContent } from '../components/common'
import { OverlayContainer } from '../components/common/effects'

import { PostClass } from '../components/common/helpers'
import { MetaData } from '../components/common/meta'

/**
* Single page (/:slug)
*
* This file renders a single page and loads all the content.
*
*/
const Page = ({ data, location }) => {
    const page = data.ghostPage
    const featImg = page.featureImageSharp && page.featureImageSharp.publicURL || page.feature_image
    const fluidFeatureImg = page.featureImageSharp && page.featureImageSharp.childImageSharp && page.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: featImg && true })

    const htmlAst = page.childHtmlRehype && page.childHtmlRehype.htmlAst
    const transformedHtml = page.childHtmlRehype && page.childHtmlRehype.html

    return (
        <React.Fragment>
            <MetaData data={data} location={location} type="website"/>
            <Helmet>
                <style type="text/css">{`${page.codeinjection_styles}`}</style>
            </Helmet>
            <OverlayContainer render={ overlay => (
                <Layout page={page} tags={page.tags} header={<HeaderPage overlay={overlay}/>} overlay={overlay}>
                    <div className="inner">
                        <article className={`post-full ${postClass}`}>
                            <header className="post-full-header">
                                <h1 className="post-full-title">{page.title}</h1>
                            </header>

                            { featImg &&
                                <figure className="post-full-image">
                                    <ImgSharp fluidClass="kg-card kg-code-card" fluidImg={fluidFeatureImg} srcImg={featImg} title={page.title} />
                                </figure>
                            }

                            {/* The main page content */}
                            <section className="post-full-content">
                                <RenderContent htmlAst={htmlAst} html={transformedHtml || page.html} />
                            </section>
                        </article>
                    </div>
                </Layout>
            )}/>
        </React.Fragment>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Page

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
