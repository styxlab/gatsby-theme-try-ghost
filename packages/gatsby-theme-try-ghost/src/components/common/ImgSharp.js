import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

import useOptions from '../../utils/use-options'

const ImgSharp = ({ fluidClass, fluidImg, srcClass, srcImg, title, clearPosition = false }) => {
    const { gatsbyImageLoading, gatsbyImageFadeIn } = useOptions()

    return (
        <React.Fragment>
            { fluidImg ? (
                <Img
                    style={{ position: `${clearPosition ? null : `relative`}` }}
                    className={fluidClass}
                    fluid={fluidImg}
                    alt={title}
                    loading={gatsbyImageLoading}
                    fadeIn={gatsbyImageFadeIn}
                />
            ) : (
                srcImg && <img className={srcClass || fluidClass} src={srcImg} alt={title} />
            )}
        </React.Fragment>
    )
}

ImgSharp.propTypes = {
    fluidClass: PropTypes.string,
    fluidImg: PropTypes.object,
    srcClass: PropTypes.string,
    srcImg: PropTypes.string,
    title: PropTypes.string.isRequired,
    clearPosition: PropTypes.bool,
}

export default ImgSharp
