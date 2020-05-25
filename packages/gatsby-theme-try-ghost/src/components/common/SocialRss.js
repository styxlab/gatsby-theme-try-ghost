import React from 'react'
import PropTypes from 'prop-types'

import RssIcon from './icons/rss-icon'

const SocialRss = ({ url }) => (
    <a className="rss-button" href={ `https://feedly.com/i/subscription/feed/${url}/rss` } target="_blank" rel="noopener noreferrer" title="Rss"><RssIcon /></a>
)

SocialRss.propTypes = {
    url: PropTypes.string.isRequired,
}

export default SocialRss
