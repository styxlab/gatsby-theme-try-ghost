import React from 'react'
import PropTypes from 'prop-types'

import { PostCard } from '.'

const PostItems = ({ posts, isHome, isAuthor }) => (
    posts.map(({ node } , i) => (
        // The tag below includes the markup for each post:
        // components/common/PostCard.js
        <PostCard key={node.id} post={node} num={i} isHome={isHome} isAuthor={isAuthor} />
    ))
)

PostItems.propTypes = {
    posts: PropTypes.array.isRequired,
    isHome: PropTypes.bool,
    isAuthor: PropTypes.bool,
    children: PropTypes.object,
}

export default PostItems
