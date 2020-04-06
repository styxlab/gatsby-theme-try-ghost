const _ = require(`lodash`)
const siteMetaConfigDefaults = require(`./src/utils/siteMetaConfigDefaults`)
const contactConfigDefaults = require(`./src/utils/contactConfigDefaults`)
const serviceConfigDefaults = require(`./src/utils/serviceConfigDefaults`)

/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = (themeOptions) => {
    const siteMeta = _.merge({}, siteMetaConfigDefaults, themeOptions.siteMetadata)
    const serviceConfig = _.merge({}, serviceConfigDefaults, themeOptions.serviceConfig)
    const pageContext = _.merge({}, contactConfigDefaults, themeOptions.pageContext, { serviceConfig: serviceConfig })

    const url = _.trim(pageContext.path, `/`)
    const nav = siteMeta.navigation

    if (nav && nav.length > 0) {
        nav.map(node => node.url = `/${url}/`)
        siteMeta.navigation = nav
    }

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
