import React from 'react'
import TagIcon from '../../../components/common/icons/tag-icon'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

const ShowTags = ({data}) => {
    const tags = data.allTagsPage.edges[0].node
    return (
        <React.Fragment>
            <a href={tags.url} className="social-link" title={tags.title}><TagIcon /></a>
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
