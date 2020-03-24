import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { Layout, HeaderPage, PostCard } from '../components/common'

const NotFoundPage = ({ data }) => {
    const posts = data.allGhostPost.edges

    return (
        <Layout header={<HeaderPage />} errorClass="error-content">
            <div className="inner">
                <section className="error-message">
                    <h1 className="error-code">404</h1>
                    <p className="error-description">Page not found</p>
                    <Link to="/" className="error-link">Go to the front page →</Link>
                </section>

                <div className="post-feed">
                    {posts.map(({ node } , i) => (
                        <PostCard key={node.id} post={node} num={i} />
                    ))}
                </div>

            </div>
        </Layout>
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
