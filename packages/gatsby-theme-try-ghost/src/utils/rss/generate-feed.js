const cheerio = require(`cheerio`)
const tagsHelper = require(`@tryghost/helpers`).tags
const _ = require(`lodash`)
const url = require(`url`)

const generateItem = function generateItem(post, settings, config) {
    const cmsUrl = settings.url
    const postUrl = post.canonical_url || post.url
    const itemUrl = _.replace(postUrl, cmsUrl , config.siteUrl)
    const transformedHtml = post.childHtmlRehype && post.childHtmlRehype.html
    const html = transformedHtml || post.html || ``
    const htmlContent = cheerio.load(html, { decodeEntities: false, xmlMode: true })

    const featureImgSharp = post.featureImageSharp && post.featureImageSharp.publicURL
    const featureImgUrl = (featureImgSharp && url.resolve(config.siteUrl, featureImgSharp)) || post.feature_image

    const item = {
        title: post.title,
        description: post.excerpt,
        guid: post.id,
        url: itemUrl,
        date: post.published_at,
        categories: _.map(tagsHelper(post, { visibility: `public`, fn: tag => tag }), `name`),
        author: post.primary_author ? post.primary_author.name : null,
        custom_elements: [],
    }

    let imageUrl
    if (featureImgUrl) {
        imageUrl = featureImgUrl

        // Add a media content tag
        item.custom_elements.push({
            'media:content': {
                _attr: {
                    url: imageUrl,
                    medium: `image`,
                },
            },
        })

        // Also add the image to the content, because not all readers support media:content
        htmlContent(`p`).first().before(`<img src="` + imageUrl + `" />`)
        htmlContent(`img`).attr(`alt`, post.title)
    }

    item.custom_elements.push({
        'content:encoded': {
            _cdata: htmlContent.html(),
        },
    })
    return item
}

const generateRSSFeed = function generateRSSFeed(siteConfig) {
    return {
        serialize: ({ query: { allGhostPost, allGhostSettings } }) => (
            allGhostPost.edges.map(edge => (
                Object.assign({}, generateItem(edge.node, allGhostSettings.edges[0].node, siteConfig))
            ))
        ),
        setup: ({ query: { allGhostSettings } }) => {
            const siteTitle = allGhostSettings.edges[0].node.title || `No Title`
            const siteDescription = allGhostSettings.edges[0].node.description || `No Description`
            const feed = {
                title: siteTitle,
                description: siteDescription,
                generator: `Jamify 1.0`,
                feed_url: `${siteConfig.siteUrl}/rss/`,
                site_url: `${siteConfig.siteUrl}/`,
                image_url: `${siteConfig.siteUrl}/${siteConfig.siteIcon}`,
                ttl: `60`,
                custom_namespaces: {
                    content: `http://purl.org/rss/1.0/modules/content/`,
                    media: `http://search.yahoo.com/mrss/`,
                },
            }
            return {
                ...feed,
            }
        },
        query: `
        {
            allGhostPost(
                sort: { fields: [featured, published_at], order: [DESC, DESC] }
            ) {
                edges {
                    node {
                        # Main fields
                        id
                        title
                        slug
                        featured
                        feature_image

                        # Dates unformatted
                        created_at
                        published_at
                        updated_at

                        # SEO
                        excerpt
                        meta_title
                        meta_description

                        # Authors
                        authors {
                            name
                        }
                        primary_author {
                            name
                        }
                        tags {
                            name
                            visibility
                        }

                        # Content
                        html

                        # Additional fields
                        url
                        canonical_url

                        childHtmlRehype {
                            html
                        }

                        featureImageSharp {
                            publicURL
                        }
                    }
                }
            }
        }
  `,
        output: `/rss`,
        title: `Jamify RSS Feed`,
    }
}

module.exports = generateRSSFeed
