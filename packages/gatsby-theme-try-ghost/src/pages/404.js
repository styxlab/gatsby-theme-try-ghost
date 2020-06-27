import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { Layout, HeaderPage, PostCard } from '../components/common'
import { OverlayContainer } from '../components/common/effects'

import useOptions from '../utils/use-options'
import { useLang, get } from '../utils/use-lang'

const NotFoundPage = ({ data }) => {
    const text = get(useLang())
    const posts = data.allGhostPost.edges
    const { basePath } = useOptions()

    return (
        <OverlayContainer render={ overlay => (
            <Layout overlay={overlay} header={<HeaderPage overlay={overlay}/>} errorClass="error-content">
                <div className="inner">
                    <section className="error-message">
                        <h1 className="error-code">404</h1>
                        <p className="error-description">{text(`PAGE_NOT_FOUND`)}</p>
                        <Link to={basePath} className="error-link">{text(`GOTO_FRONT_PAGE`)} →</Link>
                    </section>

                    <div className="post-feed">
                        {posts.map(({ node } , i) => (
                            <PostCard key={node.id} post={node} num={i} />
                        ))}
                    </div>

                </div>
            </Layout>
        )}/>
    )
}

NotFoundPage.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
}

export default NotFoundPage

export const pageQuery = graphql`
  query GhostNotFoundQuery {
    allGhostPost(
        sort: { fields: [featured, published_at], order: [DESC, DESC] },
        limit: 3,
        skip: 0
    ) {
      edges {
        node {
          ...GhostPostFieldsForIndex
        }
      }
    }
  }
`
