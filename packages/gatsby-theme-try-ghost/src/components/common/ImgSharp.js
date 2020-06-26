import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharp = ({ fluidClass, fluidImg, srcClass, srcImg, title, clearPosition = false }) => (
    <React.Fragment>
        { fluidImg ? (
            <Img style={{ position: `${clearPosition ? null : `relative`}` }} className={fluidClass} fluid={fluidImg} alt={title} />
        ) : (
            srcImg && <img className={srcClass || fluidClass} src={srcImg} alt={title} />
        )}
    </React.Fragment>
)

ImgSharp.propTypes = {
    fluidClass: PropTypes.string,
    fluidImg: PropTypes.object,
    srcClass: PropTypes.string,
    srcImg: PropTypes.string,
    title: PropTypes.string.isRequired,
    clearPosition: PropTypes.bool,
}

export default ImgSharp
