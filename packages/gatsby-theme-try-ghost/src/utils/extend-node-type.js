const sharp = require(`sharp`)

const supportedExtensions = {
    jpeg: true,
    jpg: true,
    png: true,
    webp: true,
    tif: true,
    tiff: true,
    gif: true,
    svg: true,
}

const pluginPrefix = `gatsby-theme-try-ghost`
const imageMetaCacheKey = node => `${pluginPrefix}-image-meta-${node.internal.contentDigest}`

module.exports = ({ type, cache }) => {
    if (type.name !== `File`) {
        return {}
    }

    const getImageMeta = async (fileNode) => {
        if (!supportedExtensions[fileNode.extension]) {
            return {}
        }

        const cacheKey = imageMetaCacheKey(fileNode)
        const cachedImageMeta = await cache.get(cacheKey)
        if (cachedImageMeta) {
            return cachedImageMeta
        }

        const { width, height } = await sharp(fileNode.absolutePath).metadata()
        const imageMeta = {
            width: parseInt(width, 10),
            height: parseInt(height, 10),
        }

        cache.set(cacheKey, imageMeta)
        return imageMeta
    }

    return new Promise(resolve => resolve ({
        imageMeta: {
            type: `ImageMeta`,
            resolve(fileNode) {
                return getImageMeta(fileNode)
            },
        },
    }))
}
