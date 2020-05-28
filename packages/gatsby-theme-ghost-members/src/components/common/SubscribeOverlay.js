import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

import LoaderIcon from './icons/loader-icon'
import { useLang, get } from '../../utils/use-lang'

const HiddenLabel = styled.label`
    position: absolute;
    height: 1px;
    width: 1px;
    clip: rect(1px,1px,1px,1px);
    border: 0;
    overflow: hidden;
`

const SubscribeOverlay = ({ data, overlay }) => {
    if (overlay === null || overlay === undefined) {
        return null
    }

    const text = get(useLang())
    const site = data.allGhostSettings.edges[0].node
    const { isOpen, value, message } = overlay.state
    const openingStyle = { opacity: 1, pointerEvents: `auto` }

    return (
        <div className="subscribe-overlay" style={ isOpen ? openingStyle : null } >
            <a className="subscribe-close-overlay" onClick={overlay.handleClose}></a>
            <a className="subscribe-close-button" onClick={overlay.handleClose}></a>
            <div className="subscribe-overlay-content">
                {site.logo &&
                    <img className="subscribe-overlay-logo" src={site.logo} alt={site.title} />
                }
                <div className="subscribe-form">
                    <h1 className="subscribe-overlay-title">{text(`SUBSCRIBE_TO`)} {site.title}</h1>
                    <p className="subscribe-overlay-description">{text(`SUBSCRIBE_OVERLAY`)}</p>
                    <form className={message} data-members-form="subscribe" onSubmit={overlay.handleSubmit}>
                        <div className="form-group">
                            <HiddenLabel for="email">Email</HiddenLabel>
                            <input id="email" name="email" type="email" value={value} onChange={overlay.handleChange} className="subscribe-email" data-members-email placeholder="youremail@example.com" autoComplete="false" />
                            <button className="button primary" type="submit" value="Submit">
                                <span className="button-content">{text(`SUBSCRIBE`)}</span>
                                <span className="button-loader"><LoaderIcon /></span>
                            </button>
                        </div>
                        <div className="message-success">
                            <strong>{`${text(`GREAT`)}!`}</strong> {text(`CHECK_YOUR_INBOX`)}.
                        </div>
                        <div className="message-error">
                            {text(`ENTER_VALID_EMAIL`)}!
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
