const GhostContentAPI = require(`@tryghost/content-api`)

module.exports.configure = ({ apiUrl, contentApiKey, version = `v3` }) => (
    new GhostContentAPI({
        url: apiUrl,
        key: contentApiKey,
        version: version,
    })
)
