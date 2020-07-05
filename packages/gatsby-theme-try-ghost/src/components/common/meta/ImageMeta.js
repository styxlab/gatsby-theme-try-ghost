import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

const ImageMeta = ({ image }) => {
    if (!(image && image.url)) {
        return null
    }

    return (
        <Helmet>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={image.url} />
            <meta property="og:image" content={image.url} />
            <meta property="og:image:width" content={image.imageMeta.width} />
            <meta property="og:image:height" content={image.imageMeta.height} />
        </Helmet >
    )
}

ImageMeta.propTypes = {
    image: PropTypes.object,
}

export default ImageMeta
