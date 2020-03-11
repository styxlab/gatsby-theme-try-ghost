import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav, HeaderBackground } from '.'

const HeaderTag = ({ tag, numberOfPosts }) => (
    <header className="site-archive-header">
        <div className="outer site-nav-main">
            <div className="inner">
                <SiteNav className="site-nav" />
            </div>
        </div>
        <HeaderBackground srcImg={tag.feature_image}>
            <div className="inner site-header-content">
                <h1 className="site-title">{tag.name}</h1>
                <h2 className="site-description">
                    {tag.description ||
                        `A collection of ${numberOfPosts > 0 && (numberOfPosts === 1 ? `1 post` : `${numberOfPosts} posts`) || `posts`}`
                    }
                </h2>
            </div>
        </HeaderBackground>
    </header>
)

HeaderTag.propTypes = {
    tag: PropTypes.shape({
        name: PropTypes.string.isRequired,
        feature_image: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    numberOfPosts: PropTypes.number.isRequired,
}

export default HeaderTag
