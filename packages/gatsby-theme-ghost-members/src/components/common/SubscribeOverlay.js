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
    const site = data.ghostSettings
    const cmsUrl = site.url
    const title = text(`SITE_TITLE`, site.title)
    const { isOpen, value, message } = overlay.state
    const openingStyle = { opacity: 1, pointerEvents: `auto` }
    const closingStyle = { opacity: 0, pointerEvents: null }

    if (site.logo) {
        site.logo = site.logo.replace(cmsUrl, '');
    }

    return (
        <div className="subscribe-overlay" style={ isOpen ? openingStyle : closingStyle } >
            <a className="subscribe-close-overlay" onClick={overlay.handleClose}></a>
            <a className="subscribe-close-button" onClick={overlay.handleClose}></a>
            <div className="subscribe-overlay-content">
                {site.logo &&
                    <img className="subscribe-overlay-logo" src={site.logo} alt={title} />
                }
                <div className="subscribe-form">
                    <h1 className="subscribe-overlay-title">{text(`SUBSCRIBE_TO`)} {title}</h1>
                    <p className="subscribe-overlay-description">{text(`SUBSCRIBE_OVERLAY`)}</p>
                    <form className={message} data-members-form="subscribe" onSubmit={overlay.handleSubmit}>
                        <div className="form-group">
                            <HiddenLabel htmlFor="email">{text(`EMAIL`)}</HiddenLabel>
                            <input id="email" name="email" type="email" value={value}
                                onChange={overlay.handleChange} className="subscribe-email"
                                data-members-email placeholder={text(`YOUR_EMAIL`)} autoComplete="false" />
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
        ghostSettings: PropTypes.object.isRequired,
    }).isRequired,
    overlay: PropTypes.object,
}

const SubscribeOverlayQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSubscribeOverlay {
                ghostSettings {
                    title
                    logo
                }
            }
        `}
        render={data => <SubscribeOverlay data={data} {...props} />}
    />
)

export default SubscribeOverlayQuery
