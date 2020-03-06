const _ = require(`lodash`)
const visit = require(`unist-util-visit`);

module.exports = ({ htmlAst, htmlNode, reporter }, pluginOptions) => {
    if (!htmlNode && htmlNode.url && htmlNode.slug){
        reporter.warn(`Expected url and slug not defined.`)
        return htmlAst
    }

    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }

    const cmsUrl = _.head(_.split(htmlNode.url, htmlNode.slug, 1))
    if (!isUrl(cmsUrl)) {
        return htmlAst
    }

    visit(htmlAst, {tagName: `a`}, node => {
        const href = node.properties && node.properties.href
        if (href && _.startsWith(href, cmsUrl)) {
            node.properties.href = _.replace(href, cmsUrl ,`/`)
        }
    })

    return htmlAst
}
