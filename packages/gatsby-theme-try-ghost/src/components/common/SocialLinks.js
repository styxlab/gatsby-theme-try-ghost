import React from 'react'
import PropTypes from 'prop-types'

import TwitterIcon from './icons/twitter-icon'
import FacebookIcon from './icons/facebook-icon'

import { SocialRss } from '.'

const SocialLinks = ({ site, siteUrl }) => {
    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    return (
        <React.Fragment>
            { site.facebook && <a href={ facebookUrl } className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook"><FacebookIcon /></a>}
            { site.twitter && <a href={ twitterUrl } className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon /></a>}
            <SocialRss url={siteUrl} />
        </React.Fragment>
    )
}

SocialLinks.propTypes = {
    site: PropTypes.object.isRequired,
    siteUrl: PropTypes.string.isRequired,
}

export default SocialLinks
