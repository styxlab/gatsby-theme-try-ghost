const _ = require(`lodash`)

const routing = (basePath = `/`, url, slug) => {
    // do not make assumptions about slashes, delete and re-add, remove ending slash
    const path = _.trimEnd(_.replace(`/${_.trim(basePath,`/`)}/`,`//`,`/`),`/`)

    if (!(slug !== null && slug !== undefined && slug.length > 0)) {
        return `${path}/`
    }

    if (!(url !== null && url !== undefined && url.length > 0)) {
        return `${path}/${slug}/`
    }

    if (_.trim(url,`/`) === slug) {
        return `${path}/${slug}/`
    }

    // Regexp to extract the absolute part of the CMS url
    const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/
    const cmsUrl = _.head(url.match(regexp))

    // Early exit if absolute part cannot be found
    if (!(cmsUrl !== null && cmsUrl !== undefined && cmsUrl.length > 0)) {
        return `${path}/${slug}/`
    }

    // Directory (second) part of url
    const dirUrl = _.last(_.split(url, cmsUrl, 2))

    // Normalize by stripping slug and removing bounding slashes
    const exSlug = _.trim(_.head(_.split(dirUrl, slug, 1)),`/`)

    if (exSlug.length <= 0) {
        return `${path}/${slug}/`
    }

    // Now it's safe to add slashes again
    return `${path}/${exSlug}/${slug}/`
}

const appendBasePath = (siteUrl, basePath = `/`) => {
    if (basePath === `/`) {
        return siteUrl
    }

    const url = _.trimEnd(siteUrl,`/`)
    const path = _.trim(basePath,`/`)

    return `${url}/${path}/`
}

module.exports = { routing, appendBasePath }
