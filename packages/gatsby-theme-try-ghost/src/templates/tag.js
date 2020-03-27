import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { HeaderTag, Layout, PostCard } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Tag page (/tag/:slug)
*
* Loads all posts for the requested tag incl. pagination.
*
*/
const Tag = ({ data, location }) => {
    const tag = data.ghostTag
    const posts = data.allGhostPost.edges

    return (
        <>
            <MetaData data={data} location={location} type="series"/>
            <Layout tags={[tag]} header={<HeaderTag tag={tag} numberOfPosts={posts.length} />}>
                <div className="inner posts">
                    <div className="post-feed">
                        {posts.map(({ node } , i) => (
                            // The tag below includes the markup for each post:
                            // components/common/PostCard.js
                            <PostCard key={node.id} post={node} num={i} />
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    )
}

Tag.propTypes = {
    data: PropTypes.shape({
        ghostTag: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
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
