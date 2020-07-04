import React from 'react'
import { Helmet } from "react-helmet"
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import url from 'url'

import getShareImage from './getShareImage'
import ImageMeta from './ImageMeta'

const WebsiteMeta = ({ data, settings, canonical, title, description, image, type }) => {
    const config = settings.site.siteMetadata
    settings = settings.allGhostSettings.edges[0].node
    const settingsLogo = settings.logoSharp && settings.logoSharp.publicURL

    const configLogo = (settings.logo || config.siteIcon) ? url.resolve(config.siteUrl, (settings.logo || config.siteIcon)) : null
    const publisherLogo = settingsLogo || configLogo

    const sharpImages = [image, data.featureImageSharp, settings.coverImageSharp]
    const fallbackImage = data.feature_image || settings.cover_image
    const shareImage = getShareImage(sharpImages, fallbackImage, config.siteUrl)

    description = description || data.meta_description || data.description || config.siteDescriptionMeta || settings.description
    title = `${title || data.meta_title || data.name || data.title} - ${settings.title}`

    const jsonLd = {
        "@context": `https://schema.org/`,
        "@type": type,
        url: canonical,
        image: shareImage ?
            {
                "@type": `ImageObject`,
                url: shareImage.url,
                width: shareImage.imageMeta.width,
                height: shareImage.imageMeta.height,
            } : undefined,
        publisher: {
            "@type": `Organization`,
            name: settings.title,
            logo: {
                "@type": `ImageObject`,
                url: publisherLogo,
                width: 60,
                height: 60,
            },
        },
        mainEntityOfPage: {
            "@type": `WebPage`,
            "@id": config.siteUrl,
        },
        description,
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:site_name" content={settings.title} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:url" content={canonical} />
                {settings.twitter && <meta name="twitter:site" content={`https://twitter.com/${settings.twitter.replace(/^@/, ``)}/`} />}
                {settings.twitter && <meta name="twitter:creator" content={settings.twitter} />}
                <script type="application/ld+json">{JSON.stringify(jsonLd, undefined, 4)}</script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </React.Fragment>
    )
}

WebsiteMeta.propTypes = {
    data: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    canonical: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.object,
    type: PropTypes.oneOf([`WebSite`, `Series`]).isRequired,
}

const WebsiteMetaQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsWebsiteMeta {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                site {
                    siteMetadata {
                        ...SiteMetadataFields
                    }
                }
            }
        `}
        render={data => <WebsiteMeta settings={data} {...props} />}
    />
)

export default WebsiteMetaQuery
