import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Layout, HeaderPage } from 'gatsby-theme-try-ghost/src/components/common'
import { StickyNavContainer, OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import TagView from '../components/common/TagView'
import TagHeader from '../components/common/TagHeader'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

const TagsPage = ({ data, location, pageContext }) => {
  const tags = data.allGhostTag.edges

  return (
    <React.Fragment>
      <MetaData data={data} location={location} type="article" />
      <StickyNavContainer throttle={300} isPost={true} activeClass="nav-post-title-active" render={sticky => (
        <OverlayContainer render={overlay => (
          <Layout isPost={true} overlay={overlay} header={<HeaderPage overlay={overlay} />} >
            <TagHeader />
            <TagView pageContext={pageContext} tags={tags} isHome={true} />
          </Layout>
        )} />
      )} />
    </React.Fragment>
  )
}

TagsPage.propTypes = {
  data: PropTypes.shape({
    allGhostTag: PropTypes.object.isRequired,
    file: PropTypes.object,
  }).isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default TagsPage

export const pageQuery = graphql`
  query GhostTagsQuery {
    allGhostTag {
      edges {
        node {
          count {
            posts
          }
          ...GhostTagFields
        }
      }
    }
    file(relativePath: {eq: "site-meta.png"}) {
      publicURL
      imageMeta {
          width
          height
      }
  }
  }
`