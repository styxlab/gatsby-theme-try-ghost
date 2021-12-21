import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Layout, HeaderPage } from 'gatsby-theme-try-ghost/src/components/common'
import { StickyNavContainer, OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import TagsView from '../components/common/TagsView'
import TagsHeader from '../components/common/TagsHeader'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

const TagsPage = ({ data, location, pageContext }) => {
    const tags = data.allGhostTag.edges
    const page = data.tagsPage

    return (
        <React.Fragment>
            <MetaData data={data} location={location} type="article" />
            <StickyNavContainer throttle={300} isPost={true} activeClass="nav-post-title-active" render={sticky => (
                <OverlayContainer render={overlay => (
                    <Layout isPost={true} overlay={overlay} header={<HeaderPage overlay={overlay} />} >
                        <TagsHeader title={page.title}/>
                        <TagsView pageContext={pageContext} tags={tags} isHome={true} />
                    </Layout>
                )} />
            )} />
        </React.Fragment>
    )
}

TagsPage.propTypes = {
    data: PropTypes.shape({
        tagsPage: PropTypes.object.isRequired,
        allGhostTag: PropTypes.object.isRequired,
        file: PropTypes.object,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export default TagsPage

export const pageQuery = graphql`
  query GhostTagsQuery($slug: String!) {
    tagsPage(slug: { eq: $slug }) {
        ...TagsPageFields
    }
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
