import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ className, fluidImg, fluidClass, fluidTitle }) => {
    const fluid = fluidImg && JSON.parse(fluidImg)
    const classList = className && className.split(` `) || []
    const fullWidth = classList.includes(`kg-width-full`)

    return (
        <Img
            style={{ width: `${fullWidth ? `6000px` : null}` }}
            className={fluidClass}
            fluid={fluid}
            alt={fluidTitle}
        />
    )
}

ImgSharpInline.propTypes = {
    className: PropTypes.string,
    fluidImg: PropTypes.string.isRequired,
    fluidClass: PropTypes.string,
    fluidTitle: PropTypes.string,
}

export default ImgSharpInline
