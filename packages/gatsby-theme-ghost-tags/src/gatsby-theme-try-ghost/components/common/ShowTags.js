import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'

const ShowTags = ({data}) => {
    const tags = data.allTagsPage.edges[0].node
    return (
        <React.Fragment>
            <a href={tags.url} className="social-link" title={tags.title}><FontAwesomeIcon icon={faTags} inverse /></a>
        </React.Fragment>
    )
}

ShowTags.propTypes = {
    data: PropTypes.shape({
        allTagsPage: PropTypes.object.isRequired,
    }).isRequired,
}

const ShowTagsQuery = props => (
    <StaticQuery
        query={graphql`
            query TagsSettingsForNav {
                allTagsPage {
                    edges {
                        node {
                            ...TagsPageFields
                        }
                    }
                }
            }
        `}
        render={data => <ShowTags data={data} {...props} />}
    />
)

export default ShowTagsQuery
