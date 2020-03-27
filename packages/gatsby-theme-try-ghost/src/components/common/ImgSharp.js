import React from 'react'
import PropTypes from 'prop-types'
import Img from "gatsby-image"

const ImgSharp = ({ fluidClass, fluidImg, srcClass, srcImg, title }) => (
    <>
        { fluidImg ? (
            <Img className={fluidClass} fluid={fluidImg} alt={title} />
        ) : (
            srcImg && <img className={srcClass} src={srcImg} alt={title} />
        )}
    </>
)

ImgSharp.propTypes = {
    fluidClass: PropTypes.string,
    fluidImg: PropTypes.object,
    srcClass: PropTypes.string,
    srcImg: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default ImgSharp
