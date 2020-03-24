import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav } from '.'

const HeaderPost = ({ title, sticky }) => (
    <header className="site-header">
        <div className={`outer site-nav-main ${sticky && sticky.state.currentClass}`}>
            <div className="inner">
                <SiteNav className="site-nav" postTitle={title} />
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
}

export default HeaderPost
