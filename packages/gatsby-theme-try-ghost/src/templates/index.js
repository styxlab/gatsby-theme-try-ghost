import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, HeaderIndex, Pagination } from '../components/common'
import { StickyNavContainer } from '../components/common/effects'
import { MetaData } from '../components/common/meta'

/**
* Main index page (home page)
*
* Loads all posts from Ghost
*
*/
const Index = ({ data, location, pageContext }) => {
    const posts = data.allGhostPost.edges

    return (
        <React.Fragment>
            <MetaData location={location} />
            <StickyNavContainer activeClass="fixed-nav-active" render={ sticky => (
                <Layout isHome={true} header={<HeaderIndex />} sticky={sticky}>
                    <div className="inner posts">
                        <div className="post-feed">
                            {posts.map(({ node } , i) => (
                                // The tag below includes the markup for each post:
                                // components/common/PostCard.js
                                <PostCard key={node.id} post={node} num={i} isHome={true} />
                            ))}
                        </div>
                    </div>
                    <Pagination pageContext={pageContext} />
                </Layout>
            )}/>
        </React.Fragment>
    )
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
  query GhostPostQuery($limit: Int!, $skip: Int!) {
    allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        limit: $limit,
        skip: $skip
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`
