module.exports = {

    basePath: `/`,

    collections: [{
        path: `speeches`,
        selector: node => node.primary_tag && node.primary_tag.slug === `speeches`,
    }],

}
