import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'

const ShowTagsCollection = ({data}) => {
    const tags = data.allTagsPage.edges[0].node
    return (
        <React.Fragment>
            <a href={tags.url} className="social-link" title={tags.title}><FontAwesomeIcon icon={faTags} inverse /></a>
        </React.Fragment>
    )
}

ShowTagsCollection.propTypes = {
    data: PropTypes.shape({
        allTagsPage: PropTypes.object.isRequired,
    }).isRequired,
}

const ShowTagsCollectionQuery = props => (
    <StaticQuery
        query={graphql`
            query ShowTagsCollectionForNav {
                allTagsPage {
                    edges {
                        node {
                            ...TagsPageFields
                        }
                    }
                }
            }
        `}
        render={data => <ShowTagsCollection data={data} {...props} />}
    />
)

export default ShowTagsCollectionQuery
