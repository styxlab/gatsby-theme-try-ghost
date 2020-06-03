import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { useLang, get } from '../../utils/use-lang'

import { SubscribeForm } from '.'

// The actual component
const Subscribe = ({ data }) => {
    const site = data.ghostSettings
    const cmsUrl = site.url

    const text = get(useLang())
    const title = text(`SITE_TITLE`, site.title)

    return (
        <React.Fragment>
            <h3 className="subscribe-form-title">{text(`SUBSCRIBE_TO`)} {title}</h3>
            <p className="subscribe-form-description">{text(`SUBSCRIBE_SECTION`)}</p>
            <SubscribeForm url={cmsUrl} text={text}/>
        </React.Fragment>
    )
}

Subscribe.propTypes = {
    data: PropTypes.shape({
        ghostSettings: PropTypes.object.isRequired,
    }).isRequired,
}

const SubscribeQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSubscribe {
                ghostSettings {
                    url
                    title
                }
            }
        `}
        render={data => <Subscribe data={data} {...props} />}
    />
)

export default SubscribeQuery
