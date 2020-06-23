import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt }) => {
    const classList = parentClassName && parentClassName.split(` `) || []
    const fullWidth = classList.includes(`kg-width-full`)

    const fluid = fluidImg && JSON.parse(fluidImg)

    return (
        <Img
            style={{ width: `${fullWidth ? `6000px` : null}` }}
            className={className}
            fluid={fluid}
            alt={alt}
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
