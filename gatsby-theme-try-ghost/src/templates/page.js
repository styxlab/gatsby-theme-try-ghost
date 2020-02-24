import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { HeaderPage, Layout } from '../components/common'

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
    const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: page.feature_image && true })

    return (
        <>
            <MetaData data={data} location={location} type="website"/>
            <Helmet>
                <style type="text/css">{`${page.codeinjection_styles}`}</style>
            </Helmet>
            <Layout page={page} tags={page.tags} header={<HeaderPage />}>
                <div className="inner">
                    <article className={`post-full ${postClass}`}>

                        <header className="post-full-header">
                            <h1 className="post-full-title">{page.title}</h1>
                        </header>

                        {page.feature_image &&
                            <figure className="post-full-image">
                                {/* Make image responsive */}
                                <img src={ page.feature_image } alt={ page.title } />
                            </figure>
                        }

                        {/* The main page content */}
                        <section className="post-full-content">
                            <div className="post-content load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: page.html }} />
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
            tags: PropTypes.arrayOf(
                PropTypes.object
            ),
        }).isRequired,
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
