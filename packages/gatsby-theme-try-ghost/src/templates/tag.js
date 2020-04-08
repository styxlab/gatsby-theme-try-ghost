import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { HeaderTag, Layout, PostView } from '../components/common'
import { MetaData } from '../components/common/meta'

import { GlobalStateContext } from "../context/GlobalState"

/**
* Tag page (/tag/:slug)
*
* Loads all posts for the requested tag incl. pagination.
*
*/
const Tag = ({ data, location, pageContext }) => {
    const tag = data.ghostTag
    const posts = data.allGhostPost.edges

    return (
        <GlobalStateContext.Consumer>{ g => (
            <React.Fragment>
                <MetaData data={data} location={location} type="series"/>
                <Layout tags={[tag]} header={<HeaderTag tag={tag} numberOfPosts={posts.length} />}>
                    <PostView globalState={g} pageContext={pageContext} posts={posts} />
                </Layout>
            </React.Fragment>
        )}
        </GlobalStateContext.Consumer>
    )
}

Tag.propTypes = {
    data: PropTypes.shape({
        ghostTag: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export default Tag

export const pageQuery = graphql`
    query GhostTagQuery($slug: String!, $limit: Int!, $skip: Int!) {
        ghostTag(slug: { eq: $slug }) {
            ...GhostTagFields
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            filter: {tags: {elemMatch: {slug: {eq: $slug}}}},
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
