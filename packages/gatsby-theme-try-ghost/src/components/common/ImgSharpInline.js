import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt }) => {
    const classList = parentClassName && parentClassName.split(` `) || []
    const fullWidth = classList.includes(`kg-width-full`)
    const bookmark = classList.includes(`kg-bookmark-thumbnail`)

    const fluid = fluidImg && JSON.parse(fluidImg)

    return (
        <Img
            style={{
                width: `${fullWidth ? `6000px` : null}`,
                height: `100%`,
            }}
            className={className}
            fluid={fluid}
            alt={alt}
            imgStyle={{ objectFit: `${bookmark ? `cover` : `contain`}` }}
        />
    )
}

ImgSharpInline.propTypes = {
    parentClassName: PropTypes.string,
    className: PropTypes.string,
    fluidImg: PropTypes.string.isRequired,
    alt: PropTypes.string,
}

export default ImgSharpInline
