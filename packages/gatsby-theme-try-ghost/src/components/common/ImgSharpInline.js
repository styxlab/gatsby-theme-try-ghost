import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt, maxWidth }) => {
    const classList = parentClassName && parentClassName.split(` `) || []
    const fullWidth = classList.includes(`kg-width-full`)
    const bookmark = classList.includes(`kg-bookmark-thumbnail`)
    const image = classList.includes(`kg-image-card`)

    const fluid = fluidImg && JSON.parse(fluidImg)
    const mWidth = !fullWidth && image && parseInt(maxWidth, 10) > 0 && maxWidth
    const fWidth = parseInt(maxWidth, 10) > 0 && Math.min(parseInt(maxWidth, 10), 6000) || 6000

    return (
        <Img
            style={{
                height: `100%`,
                position: `${bookmark ? null : `relative`}`,
                width: `${fullWidth ? `${fWidth}px` : null}`,
                maxWidth: `${mWidth ? `${mWidth}px` : null}`,
                margin: `${mWidth ? `auto` : null}`,
            }}
            className={className}
            fluid={fluid}
            alt={alt}
            imgStyle={{ objectFit: `${bookmark ? null : `contain`}` }}
        />
    )
}

ImgSharpInline.propTypes = {
    parentClassName: PropTypes.string,
    className: PropTypes.string,
    fluidImg: PropTypes.string.isRequired,
    alt: PropTypes.string,
    maxWidth: PropTypes.string,
}

export default ImgSharpInline
