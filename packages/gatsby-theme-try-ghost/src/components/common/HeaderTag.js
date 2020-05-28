import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav, HeaderBackground } from '.'
import { useLang, get } from '../../utils/use-lang'

const HeaderTag = ({ tag, numberOfPosts, overlay }) => {
    const text = get(useLang())

    return (
        <header className="site-archive-header">
            <div className="outer site-nav-main">
                <div className="inner">
                    <SiteNav className="site-nav" overlay={overlay}/>
                </div>
            </div>
            <HeaderBackground srcImg={tag.feature_image}>
                <div className="inner site-header-content">
                    <h1 className="site-title">{tag.name}</h1>
                    <h2 className="site-description">
                        {tag.description ||
                            `${text(`A_COLLECTION_OF`)} ${numberOfPosts > 0 && (numberOfPosts === 1 ? `1 ${text(`POST`)}` : `${numberOfPosts} ${text(`POSTS`)}`) || `${text(`POSTS`)}`}`
                        }
                    </h2>
                </div>
            </HeaderBackground>
        </header>
    )
}

HeaderTag.propTypes = {
    tag: PropTypes.shape({
        name: PropTypes.string.isRequired,
        feature_image: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    numberOfPosts: PropTypes.number.isRequired,
    overlay: PropTypes.object.isRequired,
}

export default HeaderTag
