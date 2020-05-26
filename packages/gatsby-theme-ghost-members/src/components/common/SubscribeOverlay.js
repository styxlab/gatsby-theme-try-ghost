import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import LoaderIcon from './icons/loader-icon'

const SubscribeOverlay = ({ data, overlay }) => {
    if (overlay === null || overlay === undefined) {
        return null
    }

    const site = data.allGhostSettings.edges[0].node
    const { isOpen, value, message } = overlay.state
    const openingStyle = { opacity: 1, pointerEvents: `auto` }
    const labelHidden = { position: `absolute`, height: `1px`, width: `1px`,
        clip: `rect(1px,1px,1px,1px)`, border: 0, overflow: `hidden` }

    return (
        <div className="subscribe-overlay" style={ isOpen ? openingStyle : null } >
            <a className="subscribe-close-overlay" onClick={overlay.handleClose}></a>
            <a className="subscribe-close-button" onClick={overlay.handleClose}></a>
            <div className="subscribe-overlay-content">
                {site.logo &&
                    <img className="subscribe-overlay-logo" src={site.logo} alt={site.title} />
                }
                <div className="subscribe-form">
                    <h1 className="subscribe-overlay-title">Subscribe to {site.title}</h1>
                    <p className="subscribe-overlay-description">Stay up to date! Get all the latest & greatest posts delivered straight to your inbox</p>
                    <form className={message} data-members-form="subscribe" onSubmit={overlay.handleSubmit}>
                        <div className="form-group">
                            <label for="email" style="label-hidden">Email</label>
                            <input id="email" name="email" type="email" value={value} onChange={overlay.handleChange} className="subscribe-email" data-members-email placeholder="youremail@example.com" autoComplete="false" />
                            <button className="button primary" type="submit" value="Submit">
                                <span className="button-content">Subscribe</span>
                                <span className="button-loader"><LoaderIcon /></span>
                            </button>
                        </div>
                        <div className="message-success">
                            <strong>Great!</strong> Check your inbox and click the link to confirm your subscription.
                        </div>
                        <div className="message-error">
                            Please enter a valid email address!
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

SubscribeOverlay.propTypes = {
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
    overlay: PropTypes.object,
}

const SubscribeOverlayQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSubscribeOverlay {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
            }
        `}
        render={data => <SubscribeOverlay data={data} {...props} />}
    />
)

export default SubscribeOverlayQuery
