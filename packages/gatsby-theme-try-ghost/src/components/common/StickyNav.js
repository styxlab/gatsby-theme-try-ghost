import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const StickyNav = ({ className, overlay }) => (
    <div className="outer site-nav-main">
        <div className="inner">
            <SiteNav className={className} overlay={overlay}/>
        </div>
    </div>
)

StickyNav.propTypes = {
    className: PropTypes.string.isRequired,
    overlay: PropTypes.object,
}

export default StickyNav
