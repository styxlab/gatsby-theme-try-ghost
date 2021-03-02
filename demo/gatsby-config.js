const path = require(`path`)

let siteConfig
let ghostConfig
let mediaConfig
let routesConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    mediaConfig = require(`./mediaConfig`)
} catch (e) {
    mediaConfig = null
}

try {
    routesConfig = require(`./routesConfig`)
} catch (e) {
    routesConfig = null
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
        `gatsby-plugin-preact`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                mediaConfig: mediaConfig,
                routes: routesConfig,
            },
        },
        {
            resolve: `gatsby-theme-ghost-dark-mode`,
            options: {
                // Set to true if you want your theme to default to dark mode (default: false)
                // Note that this setting has an effect only, if
                //    1. The user has not changed the dark mode
                //    2. Dark mode is not reported from OS
                defaultModeDark: false,
                // if the defaultModeDark setting should take precedence
                // over the mode reported from OS, set this to true
                // (default: false)
                overrideOS: false,
            },
        },
        {
            resolve: `gatsby-theme-ghost-members`,
        },
        {
            resolve: `gatsby-transformer-rehype`,
            options: {
                filter: node => (
                    node.internal.type === `GhostPost` ||
                    node.internal.type === `GhostPage`
                ),
                plugins: [
                    {
                        resolve: `gatsby-rehype-ghost-links`,
                    },
                    {
                        resolve: `gatsby-rehype-prismjs`,
                    },
                    {
                        resolve: `gatsby-rehype-inline-images`,
                    },
                ],
            },
        },
        //{
        //    resolve: `gatsby-theme-ghost-toc`,
        //    options: {
        //        maxDepth: 3,
        //    },
        //},
        {
            resolve: `gatsby-theme-ghost-contact`,
            options: {
                siteMetadata: {
                    navigation: [{ label: `Contact` }],
                },
                serviceConfig: {
                    url: `https://api.gotsby.org/v1/contact`,
                    contentType: `application/json`,
                },
                pageContext: {
                    title: `Contact Us`,
                    path: `/contact/`,
                    feature_image: `https://static.gotsby.org/v1/assets/images/gatsby-ghost-contact.png`,
                    custom_excerpt: `Want to get in touch with the team? Just drop us a line!`,
                    form_topics: [`I want to give feedback`, `I want to ask a question`],
                    meta_title: `Contact Us`,
                    meta_description: `A contact form page.`,
                    html: ``,
                },
            },
        },
        {
            resolve: `gatsby-theme-ghost-commento`,
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
        {
            resolve: `gatsby-plugin-gatsby-cloud`,
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // This plugin is currently causing issues: https://github.com/gatsbyjs/gatsby/issues/25360
        //`gatsby-plugin-offline`,
        //{
        //    resolve: `gatsby-theme-ghost-amp`,
        //    options: {
        //        ghostConfig: ghostConfig,
        //        siteConfig: siteConfig,
        //        routes: routesConfig,
        //    },
        //},
    ],
}
