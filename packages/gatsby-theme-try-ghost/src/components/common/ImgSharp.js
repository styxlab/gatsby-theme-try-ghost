import React from 'react'
import PropTypes from 'prop-types'
import Img from '../../../plugins/gatsby-image'

const ImgSharp = ({ wrapperStyle, fluidClass, fluidImg, srcClass, srcImg, title }) => (
    <React.Fragment>
        { fluidImg ? (
            <Img style={wrapperStyle} className={fluidClass} fluid={fluidImg} alt={title} />
        ) : (
            srcImg && <img className={srcClass} src={srcImg} alt={title} />
        )}
    </React.Fragment>
)

ImgSharp.propTypes = {
    fluidClass: PropTypes.string,
    fluidImg: PropTypes.object,
    srcClass: PropTypes.string,
    srcImg: PropTypes.string,
    title: PropTypes.string.isRequired,
    wrapperStyle: PropTypes.object,
}

export default ImgSharp
