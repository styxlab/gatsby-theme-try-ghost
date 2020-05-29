/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = (themeOptions) => {
    return {
        plugins: [
            {
                resolve: `gatsby-plugin-amp`,
                options: {
                    canonicalBaseUrl: themeOptions.siteConfig.siteUrl,
                    components: [`amp-form`],
                    excludedPaths: [`/404*`, `/`],
                    pathIdentifier: `amp/`,
                    relAmpHtmlPattern: `{{canonicalBaseUrl}}{{pathname}}{{pathIdentifier}}`,
                    useAmpClientIdApi: true,
                },
            },
        ],
    }
}
