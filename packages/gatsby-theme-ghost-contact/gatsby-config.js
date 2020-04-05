const _ = require(`lodash`)

/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = (themeOptions) => {
    const url = _.trim(themeOptions.pageContext.path, `/`)

    const siteMeta = themeOptions.siteMetadata
    const nav = siteMeta && siteMeta.navigation

    if (nav && nav.length > 0) {
        nav.map(node => node.url = `/${url}/`)
        siteMeta.navigation = nav
    }
    console.log(siteMeta)

    return {
        siteMetadata: siteMeta,
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
