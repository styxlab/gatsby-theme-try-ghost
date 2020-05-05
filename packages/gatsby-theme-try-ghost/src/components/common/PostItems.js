import React from 'react'
import PropTypes from 'prop-types'

import { PostCard } from '.'

const PostItems = ({ posts, isHome, isAuthor, collectionPath }) => (
    posts.map(({ node } , i) => (
        // The tag below includes the markup for each post:
        // components/common/PostCard.js
        <PostCard key={node.id} post={node} collectionPath={collectionPath} num={i} isHome={isHome} isAuthor={isAuthor} />
    ))
)

PostItems.propTypes = {
    posts: PropTypes.array.isRequired,
    collectionPath: PropTypes.string,
    isHome: PropTypes.bool,
    isAuthor: PropTypes.bool,
    children: PropTypes.object,
}

export default PostItems
