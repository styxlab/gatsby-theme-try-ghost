import React from 'react'
import PropTypes from 'prop-types'

import { PostCard, Pagination, InfiniteScroll } from '../components/common'

class PostView extends React.Component {
    constructor(props) {
        super(props)
        if (props.globalState.isInitializing() || !props.globalState.useInfiniteScroll) {
            props.globalState.updateState({
                items: props.pageContext.initialPosts,
                cursor: props.pageContext.currentPage + 1,
            })
        }
    }

    render() {
        const {
            globalState: g,
            pageContext,
            posts,
            isHome,
            isAuthor,
        } = this.props

        const items = (!g.isInitializing() ? g.items : posts)

        return (
            <React.Fragment>
                <div className="inner posts">
                    <div className="post-feed">
                        <InfiniteScroll throttle={300} threshold={600} isLoading={g.isLoading} hasMore={g.hasMore(pageContext)} onLoadMore={g.loadMore}>

                            {items.map(({ node } , i) => (
                                // The tag below includes the markup for each post:
                                // components/common/PostCard.js
                                <PostCard key={node.id} post={node} num={i} isHome={isHome} isAuthor={isAuthor}/>
                            ))}

                        </InfiniteScroll>
                    </div>
                </div>
                <Pagination pageContext={pageContext} />
            </React.Fragment>
        )
    }
}

PostView.propTypes = {
    globalState: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
    isHome: PropTypes.bool,
    isAuthor: PropTypes.bool,
}

export default PostView
