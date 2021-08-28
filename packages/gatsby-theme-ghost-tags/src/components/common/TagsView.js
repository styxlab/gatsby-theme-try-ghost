import React from 'react'
import PropTypes from 'prop-types'

import { Pagination } from 'gatsby-theme-try-ghost/src/components/common'
import TagItems from './TagItems'

class TagsView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      pageContext,
      tags,
      isHome,
    } = this.props

    tags.forEach(({ node }) => {
      node.collectionPath = pageContext.collectionPath || (pageContext.collectionPaths && pageContext.collectionPaths[node.id])
    })

    return (
      <React.Fragment>
        <div className="inner posts">
          <div className="post-feed">
            <TagItems tags={tags} isHome={isHome} />
          </div>
        </div>
        <Pagination pageContext={pageContext} />
      </React.Fragment>
    )
  }
}

TagsView.propTypes = {
  pageContext: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  isHome: PropTypes.bool,
}

export default TagsView