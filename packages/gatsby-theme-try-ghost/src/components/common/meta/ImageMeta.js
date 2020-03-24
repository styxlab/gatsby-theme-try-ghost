import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import { StaticQuery, graphql } from 'gatsby'

const ImageMeta = ({ settings, image }) => {
    const config = settings.site.siteMetadata

    if (!image) {
        return null
    }

    return (
        <Helmet>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={image} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content={config.shareImageWidth} />
            <meta property="og:image:height" content={config.shareImageHeight} />
        </Helmet >
    )
}

ImageMeta.propTypes = {
    settings: PropTypes.shape({
        site: PropTypes.object.isRequired,
    }).isRequired,
    image: PropTypes.string,
}

const ImageMetaQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsImageMeta {
                site {
                    siteMetadata {
                        ...SiteMetadataFields
                    }
                }
            }
        `}
        render={data => <ImageMeta settings={data} {...props} />}
    />
)

export default ImageMetaQuery
