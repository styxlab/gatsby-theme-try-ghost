import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const HeaderPage = ({ overlay }) => (
    <header className="site-header">
        <div className="outer site-nav-main">
            <div className="inner">
                <SiteNav className="site-nav" overlay={overlay}/>
            </div>
        </div>
    </header>
)

HeaderPage.propTypes = {
    overlay: PropTypes.object.isRequired,
}

export default HeaderPage
