import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt, maxWidth = 0 }) => {
    const classList = parentClassName && parentClassName.split(` `) || []
    const fullWidth = classList.includes(`kg-width-full`)
    const bookmark = classList.includes(`kg-bookmark-thumbnail`)

    const fluid = fluidImg && JSON.parse(fluidImg)
    const mWidth = !fullWidth && maxWidth > 0 && parseInt(maxWidth, 10)

    return (
        <Img
            style={{
                height: `100%`,
                position: `${bookmark ? null : `relative`}`,
                width: `${fullWidth ? `6000px` : null}`,
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
    maxWidth: PropTypes.number,
}

export default ImgSharpInline
