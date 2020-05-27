import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { useLang, get } from '../../utils/use-lang'

import { SubscribeForm } from '.'

// The actual component
const Subscribe = ({ data }) => {
    const text = get(useLang())
    const site = data.allGhostSettings.edges[0].node
    const cmsUrl = data.ghostConfig.cmsUrl

    return (
        <React.Fragment>
            <h3 className="subscribe-form-title">{text(`SUBSCRIBE_TO`)} {site.title}</h3>
            <p className="subscribe-form-description">{text(`SUBSCRIBE_SECTION`)}</p>
            <SubscribeForm url={cmsUrl} text={text}/>
        </React.Fragment>
    )
}

Subscribe.propTypes = {
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
        ghostConfig: PropTypes.object.isRequired,
    }).isRequired,
}

const SubscribeQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSubscribe {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                ghostConfig(id: { eq: "gatsby-theme-try-ghost-config" }) {
                    cmsUrl
                }
            }
        `}
        render={data => <Subscribe data={data} {...props} />}
    />
)

export default SubscribeQuery
