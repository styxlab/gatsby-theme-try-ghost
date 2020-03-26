import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const StickyNav = ({ className, theme }) => (
    <div className="outer site-nav-main">
        <div className="inner">
            <SiteNav className={className} theme={theme} />
        </div>
    </div>
)

StickyNav.propTypes = {
    className: PropTypes.string.isRequired,
    theme: PropTypes.shape({
        flavor: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
    }).isRequired,
}

export default StickyNav
