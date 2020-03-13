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
