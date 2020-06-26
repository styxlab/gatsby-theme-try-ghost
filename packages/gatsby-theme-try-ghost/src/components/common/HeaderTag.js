import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav, HeaderBackground } from '.'
import { useLang, get } from '../../utils/use-lang'

const HeaderTag = ({ tag, numberOfPosts, overlay }) => {
    const text = get(useLang())
    const featureImg = tag.featureImageSharp && tag.featureImageSharp.publicURL || tag.feature_image

    return (
        <header className="site-archive-header">
            <div className="outer site-nav-main">
                <div className="inner">
                    <SiteNav className="site-nav" overlay={overlay}/>
                </div>
            </div>
            <HeaderBackground fluidImg={tag.featureImageSharp} srcImg={featureImg}>
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
    tag: PropTypes.object.isRequired,
    numberOfPosts: PropTypes.number.isRequired,
    overlay: PropTypes.object.isRequired,
}

export default HeaderTag
