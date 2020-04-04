const _ = require(`lodash`)

const routing = (url, slug) => {
    // Regexp to extract the absolute part of the CMS url
    // const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^\/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/
    const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/
    const cmsUrl = _.head(url.match(regexp))

    // Directory (second) part of url
    const dirUrl = _.last(_.split(url, cmsUrl, 2))

    // Normalize by stripping slug and removing bounding slashes
    const exSlug = _.trim(_.head(_.split(dirUrl, slug, 1)),`/`)

    // Now it's safe to add slashes again
    return `/${exSlug}/${slug}/`
}

module.exports = routing
