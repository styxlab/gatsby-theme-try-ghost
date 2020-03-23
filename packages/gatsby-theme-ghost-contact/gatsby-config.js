/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = (themeOptions) => {
    return {
        siteMetadata: themeOptions.siteMetadata,
        plugins: [
            {
                resolve: `gatsby-plugin-ghost-images`,
                options: {
                    lookup: [
                        {
                            type: `ContactPage`,
                            imgTags: [`feature_image`],
                        },
                    ],
                    verbose: true,
                },
            },
        ],
    }
}
