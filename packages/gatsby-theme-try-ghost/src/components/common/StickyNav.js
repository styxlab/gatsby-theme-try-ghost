import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const StickyNav = ({ className }) => (
    <div className="outer site-nav-main">
        <div className="inner">
            <SiteNav className={className} />
        </div>
    </div>
)

StickyNav.propTypes = {
    className: PropTypes.string.isRequired,
}

export default StickyNav
