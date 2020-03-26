import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const HeaderPage = ({ theme }) => (
    <header className="site-header">
        <div className="outer site-nav-main">
            <div className="inner">
                <SiteNav theme={theme} className="site-nav" />
            </div>
        </div>
    </header>
)

HeaderPage.propTypes = {
    theme: PropTypes.shape({
        flavor: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
    }).isRequired,
}

export default HeaderPage
