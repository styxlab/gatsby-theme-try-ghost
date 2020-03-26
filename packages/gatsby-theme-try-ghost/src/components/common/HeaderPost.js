import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const HeaderPost = ({ title, sticky, theme }) => (
    <header className="site-header">
        <div className={`outer site-nav-main ${sticky && sticky.state.currentClass}`}>
            <div className="inner">
                <SiteNav theme={theme} className="site-nav" postTitle={title} />
            </div>
        </div>
    </header>
)

HeaderPost.propTypes = {
    title: PropTypes.string.isRequired,
    sticky: PropTypes.shape({
        state: PropTypes.shape({
            currentClass: PropTypes.string,
        }).isRequired,
    }).isRequired,
    theme: PropTypes.shape({
        flavor: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
    }).isRequired,
}

export default HeaderPost
