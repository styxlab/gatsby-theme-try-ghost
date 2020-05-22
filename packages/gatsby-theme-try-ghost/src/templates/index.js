import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostView, HeaderIndex } from '../components/common'
import { StickyNavContainer } from '../components/common/effects'
import { MetaData } from '../components/common/meta'

import { GlobalStateContext } from "../context/GlobalState"

/**
* Main index page (home page)
*
* Loads all posts from Ghost
*
*/
const Index = ({ data, location, pageContext }) => {
    const posts = data.allGhostPost.edges

    return (
        <GlobalStateContext.Consumer>{ g => (
            <React.Fragment>
                <MetaData location={location} />
                <StickyNavContainer throttle={300} activeClass="fixed-nav-active" render={ sticky => (
                    <Layout isHome={true} header={<HeaderIndex />} sticky={sticky}>
                        <PostView globalState={g} pageContext={pageContext} posts={posts} isHome={true} />
                    </Layout>
                )}/>
            </React.Fragment>
        )}
        </GlobalStateContext.Consumer>
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

// This page query loads all posts
// Note that the initial sorting is based on the source plugin
// Therefore the sorting within $postIds is irrelevant!
export const pageQuery = graphql`
  query GhostPostQuery($postIds: [String!]!, $limit: Int!, $skip: Int!) {
    allGhostPost(
        filter: {id: { in: $postIds }},
        limit: $limit,
        skip: $skip,
        sort: { order: DESC, fields: [featured] },
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`

