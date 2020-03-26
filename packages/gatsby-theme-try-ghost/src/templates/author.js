import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, HeaderAuthor } from '../components/common'
import { DarkThemeProvider } from '../components/common/effects'
import { MetaData } from '../components/common/meta'

/**
* Author page (/author/:slug)
*
* Loads all posts for the requested author incl. pagination.
*
*/
const Author = ({ data, location }) => {
    const posts = data.allGhostPost.edges
    const author = data.ghostAuthor

    return (
        <>
            <MetaData location={location} data={data} type="profile"/>
            <DarkThemeProvider render={ theme => (
                <Layout theme={theme.state} author={author} header={<HeaderAuthor theme={theme.state} author={author} numberOfPosts={posts.length}/>}>
                    <div className="inner posts">
                        <div className="post-feed">
                            {posts.map(({ node } , i) => (
                                // The tag below includes the markup for each post - components/common/PostCard.js
                                <PostCard key={node.id} post={node} num={i} isAuthor={true}/>
                            ))}
                        </div>
                    </div>
                </Layout>
            )}/>
        </>
    )
}

Author.propTypes = {
    data: PropTypes.shape({
        ghostAuthor: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
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
