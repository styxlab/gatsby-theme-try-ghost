let siteConfig
let ghostConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        development: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        ghostConfig = null //allow default config to take over
    }
}

module.exports = {
    plugins: [
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                // Downloads and caches images from Ghost CMS to the local filesystem.
                // Use for awesome performance and usability (default: true)
                downloadLocal: true,
            },
        },
        {
            resolve: `gatsby-theme-ghost-contact`,
            options: {
                siteMetadata: {
                    navigation: [{ label: `Contact`, url: `/contact/` }],
                },
                serviceConfig: {
                    url: `https://api.gotsby.org/v1/contact`,
                },
                pageContext: {
                    title: `Contact Us`,
                    slug: `contact`,
                    feature_image: `https://static.gotsby.org/v1/assets/images/contact-bluish.png`,
                    custom_excerpt: `Want to get in touch with the team? Just drop us a line!`,
                    form_topics: [`I want to give feedback`, `I want to ask a question`],
                    meta_title: `Contact Us`,
                    meta_description: `A contact form page.`,
                    html: ``,
                },
            },
        },
        {
            resolve: `gatsby-plugin-ackee-tracker`,
            options: {
                domainId: `8af98f2e-a3a0-44dd-85fe-91c6dd3d2f62`,
                server: `https://analytics.atmolabs.org`,
                ignoreLocalhost: true,
                // If enabled it will collect info on OS, BrowserInfo, Device  & ScreenSize
                detailed: true,
            },
        },
    ],
}
