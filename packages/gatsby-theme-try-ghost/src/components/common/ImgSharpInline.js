import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt, maxWidth }) => {
    const classList = parentClassName && parentClassName.split(` `) || []
    const wideWidth = classList.includes(`kg-width-wide`) ? 1040 : null
    const fullWidth = classList.includes(`kg-width-full`) ? 5000 : null
    const bookmark = classList.includes(`kg-bookmark-thumbnail`)
    const bookmarkMeta = classList.includes(`kg-bookmark-metadata`)
    const image = classList.includes(`kg-image-card`) ? 700 : null
    const max = wideWidth || fullWidth || image
    const fluid = fluidImg && JSON.parse(fluidImg)
    const widthInt = parseInt(maxWidth, 10)
    const mWidth = !fullWidth && image && widthInt > 0 && maxWidth
    const width = widthInt > 0 && Math.min(widthInt, max)

    const style = {
        height: `100%`,
        position: bookmark ? `static` : `relative`,
        margin: bookmarkMeta ? null : (mWidth ? `auto` : `0 auto`),
        width: bookmark || width && width > 0 ? `${width}px` : (bookmarkMeta ? null : `100%`),
        maxWidth: `100${fullWidth ? 'vw' : '%' }`,
    }

    return (
        <Img
            style={{...style}}
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
