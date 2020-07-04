import React from 'react'
import { Helmet } from "react-helmet"
import { StaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import _ from 'lodash'
import url from 'url'

import getAuthorProperties from './getAuthorProperties'
import getShareImage from './getShareImage'
import ImageMeta from './ImageMeta'

import { tags as tagsHelper } from '@tryghost/helpers'

const ArticleMetaGhost = ({ data, settings, canonical }) => {
    const ghostPost = data
    const config = settings.site.siteMetadata
    settings = settings.allGhostSettings.edges[0].node
    const settingsLogo = settings.logoSharp && settings.logoSharp.publicURL

    const author = getAuthorProperties(ghostPost.primary_author)
    const publicTags = _.map(tagsHelper(ghostPost, { visibility: `public`, fn: tag => tag }), `name`)
    const primaryTag = publicTags[0] || ``

    const sharpImages = [ghostPost.featureImageSharp, settings.coverImageSharp]
    const fallbackImage = ghostPost.feature_image || settings.cover_image
    const shareImage = getShareImage(sharpImages, fallbackImage, config.siteUrl)

    const configLogo = (settings.logo || config.siteIcon) ? url.resolve(config.siteUrl, (settings.logo || config.siteIcon)) : null
    const publisherLogo = settingsLogo || configLogo

    const jsonLd = {
        "@context": `https://schema.org/`,
        "@type": `Article`,
        author: {
            "@type": `Person`,
            name: author.name,
            image: author.image ? author.image : undefined,
            sameAs: author.sameAsArray ? author.sameAsArray : undefined,
        },
        keywords: publicTags.length ? publicTags.join(`, `) : undefined,
        headline: ghostPost.meta_title || ghostPost.title,
        url: canonical,
        datePublished: ghostPost.published_at,
        dateModified: ghostPost.updated_at,
        image: shareImage ? {
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
        description: ghostPost.meta_description || ghostPost.excerpt,
        mainEntityOfPage: {
            "@type": `WebPage`,
            "@id": config.siteUrl,
        },
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{ghostPost.meta_title || ghostPost.title}</title>
                <meta name="description" content={ghostPost.meta_description || ghostPost.excerpt} />
                <link rel="canonical" href={canonical} />

                <meta property="og:site_name" content={settings.title} />
                <meta property="og:type" content="article" />
                <meta property="og:title"
                    content={
                        ghostPost.og_title ||
                        ghostPost.meta_title ||
                        ghostPost.title
                    }
                />
                <meta property="og:description"
                    content={
                        ghostPost.og_description ||
                        ghostPost.excerpt ||
                        ghostPost.meta_description
                    }
                />
                <meta property="og:url" content={canonical} />
                <meta property="article:published_time" content={ghostPost.published_at} />
                <meta property="article:modified_time" content={ghostPost.updated_at} />
                {publicTags.map((keyword, i) => (<meta property="article:tag" content={keyword} key={i} />))}
                {author.facebookUrl && <meta property="article:author" content={author.facebookUrl} />}

                <meta name="twitter:title"
                    content={
                        ghostPost.twitter_title ||
                        ghostPost.meta_title ||
                        ghostPost.title
                    }
                />
                <meta name="twitter:description"
                    content={
                        ghostPost.twitter_description ||
                        ghostPost.excerpt ||
                        ghostPost.meta_description
                    }
                />
                <meta name="twitter:url" content={canonical} />
                <meta name="twitter:label1" content="Written by" />
                <meta name="twitter:data1" content={author.name} />
                {primaryTag && <meta name="twitter:label2" content="Filed under" />}
                {primaryTag && <meta name="twitter:data2" content={primaryTag} />}

                {settings.twitter && <meta name="twitter:site" content={`https://twitter.com/${settings.twitter.replace(/^@/, ``)}/`} />}
                {settings.twitter && <meta name="twitter:creator" content={settings.twitter} />}
                <script type="application/ld+json">{JSON.stringify(jsonLd, undefined, 4)}</script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </React.Fragment>
    )
}

ArticleMetaGhost.propTypes = {
    data: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    canonical: PropTypes.string.isRequired,
}

const ArticleMetaQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsArticleMeta {
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
        render={data => <ArticleMetaGhost settings={data} {...props} />}
    />
)

export default ArticleMetaQuery
