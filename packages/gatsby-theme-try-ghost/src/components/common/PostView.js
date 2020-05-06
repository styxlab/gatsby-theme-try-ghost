import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from "styled-components"
import { FaSpinner } from 'react-icons/fa/'

import { PostItems, Pagination } from '.'
import { InfiniteScroll } from './effects'

const rotate = keyframes`
    to {
        transform: rotate(360deg);
    }
`

const Spinner = styled.div`
    margin: -4vw 0vw 4.5vw;
    font-size: 30px;
    text-align: center;
    display: ${props => (props.infiniteScroll ? `block` : `none`)};

    & > svg {
        fill: #738a94;
        animation: ${rotate} 3s linear infinite;
    }
`

class PostView extends React.Component {
    constructor(props) {
        super(props)
        props.globalState.initItems(props.pageContext, props.posts)
    }

    render() {
        const {
            globalState: g,
            pageContext,
            posts,
            isHome,
            isAuthor,
        } = this.props

        const items = (!g.isInitializing() ? g.getItems(pageContext) : posts)
        items.forEach(({ node }) => {
            node.collectionPath = pageContext.collectionPath || (pageContext.collectionPaths && pageContext.collectionPaths[node.id])
        })

        return (
            <React.Fragment>
                <div className="inner posts">
                    <div className="post-feed">
                        <InfiniteScroll throttle={300} threshold={900} isLoading={g.isLoading} hasMore={g.hasMore(pageContext)} onLoadMore={g.loadMore(pageContext)}>
                            <PostItems posts={items} isHome={isHome} isAuthor={isAuthor} />
                        </InfiniteScroll>
                    </div>
                </div>

                {/* Loading spinner. */}
                {g.isLoading &&
                    <Spinner infiniteScroll={g.useInfiniteScroll} >
                        <FaSpinner/>
                    </Spinner>
                }

                {/* Fallback to Pagination for non JS users. */}
                {g.useInfiniteScroll &&
                    <noscript>
                        <style>
                            {`.spinner { display: none !important; }`}
                        </style>
                        <Pagination pageContext={pageContext} />
                    </noscript>
                }

                {/* Fallback to Pagination on error. */}
                {!g.useInfiniteScroll &&
                    <Pagination pageContext={pageContext} />
                }

            </React.Fragment>
        )
    }
}

PostView.propTypes = {
    globalState: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
    posts: PropTypes.array.isRequired,
    isHome: PropTypes.bool,
    isAuthor: PropTypes.bool,
}

export default PostView
