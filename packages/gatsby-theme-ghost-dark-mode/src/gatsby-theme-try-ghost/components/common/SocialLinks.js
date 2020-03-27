import React from 'react'
import PropTypes from 'prop-types'
import { DarkModeToggle } from '../../../components/common'

import RssIcon from 'gatsby-theme-try-ghost/src/components/common/icons/rss-icon'
import TwitterIcon from 'gatsby-theme-try-ghost/src/components/common/icons/twitter-icon'
import FacebookIcon from 'gatsby-theme-try-ghost/src/components/common/icons/facebook-icon'

const SocialLinks = ({ site, siteUrl }) => {
    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    return (
        <>
            { site.facebook && <a href={ facebookUrl } className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook"><FacebookIcon /></a>}
            { site.twitter && <a href={ twitterUrl } className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon /></a>}
            <a className="rss-button" href={ `https://feedly.com/i/subscription/feed/${siteUrl}/rss` } target="_blank" rel="noopener noreferrer" title="Rss"><RssIcon /></a>
            <DarkModeToggle />
        </>
    )
}

SocialLinks.propTypes = {
    site: PropTypes.object.isRequired,
    siteUrl: PropTypes.string.isRequired,
}

export default SocialLinks
