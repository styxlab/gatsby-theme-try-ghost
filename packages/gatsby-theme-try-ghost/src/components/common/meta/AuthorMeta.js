import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import ImageMeta from './ImageMeta'
import getAuthorProperties from './getAuthorProperties'
import getShareImage from './getShareImage'

const AuthorMeta = ({ data, settings, canonical }) => {
    const config = settings.site.siteMetadata
    settings = settings.allGhostSettings.edges[0].node

    const author = getAuthorProperties(data)
    const sharpImages = [author.image, data.coverImageSharp, settings.coverImageSharp]
    const shareImage = getShareImage(sharpImages, settings.cover_image, config.siteUrl)

    const title = `${data.name} - ${settings.title}`
    const description = data.bio || config.siteDescriptionMeta || settings.description

    const jsonLd = {
        "@context": `https://schema.org/`,
        "@type": `Person`,
        name: data.name,
        sameAs: author.sameAsArray ? author.sameAsArray : undefined,
        url: canonical,
        image: shareImage ? {
            "@type": `ImageObject`,
            url: shareImage.url,
            width: shareImage.imageMeta.width,
            height: shareImage.imageMeta.height,
        } : undefined,
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
                <meta property="og:type" content="profile" />
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

AuthorMeta.propTypes = {
    data: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    canonical: PropTypes.string.isRequired,
}

const AuthorMetaQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsAuthorMeta {
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
        render={data => <AuthorMeta settings={data} {...props} />}
    />
)

export default AuthorMetaQuery
