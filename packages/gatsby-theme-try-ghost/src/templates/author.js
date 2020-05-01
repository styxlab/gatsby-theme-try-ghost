import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostView, HeaderAuthor } from '../components/common'
import { MetaData } from '../components/common/meta'

import { GlobalStateContext } from "../context/GlobalState"

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
        <GlobalStateContext.Consumer>{ g => (
            <React.Fragment>
                <MetaData location={location} data={data} type="profile"/>
                <Layout author={author} header={<HeaderAuthor author={author} numberOfPosts={data.postCount.edges.length}/>}>
                    <PostView globalState={g} pageContext={pageContext} posts={posts} isAuthor={true} />
                </Layout>
            </React.Fragment>
        )}
        </GlobalStateContext.Consumer>
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
        count: allGhostPost(
            filter: {authors: {elemMatch: {slug: {eq: $slug}}}}
        ) {
            edges {
                node {
                    id
                }
            }
        }
    }
`

export default Author
