const _ = require(`lodash`)

// higher order function
const withBasePath = basePath => path => normalizePath(`/${basePath}/${path}/`)

const normalizePath = (path) => {
    const normalize = `/${_.trim(path,`/`)}/`
    return normalize.replace(`////`,`/`).replace(`///`,`/`).replace(`//`,`/`)
}

const splitUrl = (url) => {
    // Regexp to extract the absolute part of the CMS url
    const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/

    const [absoluteUrl] = url.match(regexp) || []
    const relativeUrl = url.split(absoluteUrl, 2).join(`/`)
    return ({
        absolute: absoluteUrl,
        relative: relativeUrl,
    })
}

const resolveUrl = (basePath = `/`, slug, url) => {
    // resolvePath is a function!
    const resolvePath = withBasePath(basePath)

    if (!(slug !== null && slug !== undefined && slug.length > 0)) {
        return normalizePath(basePath)
    }

    if (!(url !== null && url !== undefined && url.length > 0)) {
        return resolvePath(slug)
    }

    if (_.trim(url,`/`) === slug) {
        return resolvePath(slug)
    }

    const { absolute: cmsUrl, relative: dirUrl } = splitUrl(url)

    // Early exit if absolute part cannot be found
    if (!(cmsUrl !== null && cmsUrl !== undefined && cmsUrl.length > 0)) {
        return resolvePath(slug)
    }
    return resolvePath(dirUrl)
}

const appendBasePath = (siteUrl, basePath = `/`) => {
    if (basePath === `/`) {
        return siteUrl
    }

    const url = _.trimEnd(siteUrl,`/`)
    const path = normalizePath(basePath)

    return `${url}${path}`
}

module.exports = { resolveUrl, appendBasePath }
