import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, HeaderAuthor, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Author page (/author/:slug)
*
* Loads all posts for the requested author incl. pagination.
*
*/
const Author = ({ data, location, pageContext }) => {
    const posts = data.allGhostPost.edges
    const author = data.ghostAuthor

    return (
        <React.Fragment>
            <MetaData location={location} data={data} type="profile"/>
            <Layout author={author} header={<HeaderAuthor author={author} numberOfPosts={posts.length}/>}>
                <div className="inner posts">
                    <div className="post-feed">
                        {posts.map(({ node } , i) => (
                            // The tag below includes the markup for each post:
                            // components/common/PostCard.js
                            <PostCard key={node.id} post={node} num={i} isAuthor={true}/>
                        ))}
                    </div>
                </div>
                <Pagination pageContext={pageContext} />
            </Layout>
        </React.Fragment>
    )
}

Author.propTypes = {
    data: PropTypes.shape({
        ghostAuthor: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export const pageQuery = graphql`
    query GhostAuthorQuery($slug: String!, $limit: Int!, $skip: Int!) {
        ghostAuthor(slug: { eq: $slug }) {
            ...GhostAuthorFields
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            filter: {authors: {elemMatch: {slug: {eq: $slug}}}},
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

export default Author
