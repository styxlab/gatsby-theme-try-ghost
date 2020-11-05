const _ = require(`lodash`)
const visit = require(`unist-util-visit-parents`)

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { fluid } = require(`gatsby-plugin-sharp`)
const sharp = require(`sharp`)

const fs = require(`fs-extra`)
const path = require(`path`)

const supportedExtensions = {
    jpeg: true,
    jpg: true,
    png: true,
    webp: true,
    tif: true,
    tiff: true,
}

const fileCacheKey = url => `gatsby-rehype-inline-images-file-${url}`
const fluidImageCacheKey = key => `gatsby-rehype-inline-images-fluid-image-${key}`

const getContext = (node, field) => node && node.context && node.context[field]

const copyToStatic = async ({ file, pathPrefix = `` }) => {
    const fileName = `${file.internal.contentDigest}/${file.base}`

    const publicPath = path.join(process.cwd(), `public`, `static`, fileName)

    let fileExists
    try {
        fileExists = await fs.stat(publicPath)
    } catch {
        fileExists = false
    }

    if (!fileExists) {
        try {
            await fs.copy(file.absolutePath, publicPath, { dereference: true })
        } catch (err) {
            console.error(`error copying file from ${file.absolutePath} to ${publicPath}`, err)
        }
    }

    return `${pathPrefix}/static/${fileName}`
}

module.exports = async (pluginParams, pluginOptions) => {
    const { htmlAst, htmlNode, reporter } = pluginParams
    const url = getContext(htmlNode, `url`)
    const slug = getContext(htmlNode, `slug`)

    if (!url && slug){
        reporter.warn(`Expected url and slug not defined.`)
        return htmlAst
    }

    function isUrl(s) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        return regexp.test(s)
    }

    const cmsUrl = _.head(_.split(url, slug, 1))
    if (!isUrl(cmsUrl)) {
        return htmlAst
    }

    const nodes = []
    visit(htmlAst, { tagName: `img` }, async (node, ancestor) => {
        const directAncestor = ancestor.reverse()[0]
        nodes.push({ node, ancestor: directAncestor })
        reporter.info(node.properties.src)
    })

    const images = await Promise.all(nodes.map(({ node }) => replaceNewImage(node, pluginParams, pluginOptions)))

    images.forEach((image, i) => {
        if (image) {
            const { node, ancestor } = nodes[i]
            // save original tag to special property
            node.properties.htmlTag = node.tagName

            // add new tag and properties for React component
            node.tagName = `img-sharp-inline`
            node.properties.className = image.className
            node.properties.fluidImg = JSON.stringify(image.fluid)
            node.properties.alt = image.alt
            node.properties.maxWidth = image.maxWidth

            // add new class to parent for styling
            const fluidClass = `fluid-image`
            const parentClass = ancestor.properties.className
            ancestor.properties.className = Array.isArray(parentClass) && [...parentClass, fluidClass] || [fluidClass]
            node.properties.parentClassName = ancestor.properties.className

            // add flex style to parent to keep aspect ratio
            const flex = `flex: ${image.aspectRatio} 1 0`
            const parentStyle = ancestor.properties.style
            ancestor.properties.style = Array.isArray(parentStyle) && [...parentStyle, flex] || [flex]

            // do not include these props in html output
            node.properties.htmlClearProps = [`className`, `fluidImg`, `parentClassName`]
        }
    })

    return htmlAst
}

const replaceNewImage = async (node, pluginParams, pluginOptions) => {
    const url = node.properties.src.replace(/^\/\//,`https://`)

    if (!url) {
        return false
    }

    let fileNode
    try {
        fileNode = await downloadMediaFile({ url, pluginParams })
    } catch (e) {
        throw Error(e)
    }

    if (!fileNode) {
        return false
    }

    // unsupported image files are copied to the `/static` folder
    if (!supportedExtensions[fileNode.extension]) {
        const { pathPrefix } = pluginParams
        const src = await copyToStatic({ file: fileNode, pathPrefix })

        // mutate here
        node.properties.src = src
        return false
    }

    // process supported images
    return await processImage({ fileNode, node, pluginParams, pluginOptions })
}

const processImage = async ({ fileNode, node, pluginParams, pluginOptions }) => {
    const image = { url: node.properties.src }
    const classList = node.properties.className || []
    image.alt = node.properties.alt || fileNode.name
    image.className = classList.join(` `)

    const { fluidResult, aspectRatio, maxWidth } = await fluidImage({ fileNode, pluginParams, pluginOptions })
    image.fluid = fluidResult
    image.aspectRatio = aspectRatio
    image.maxWidth = maxWidth

    return image
}

// imageCache can be disabled if you need to save memory
const fluidImage = async ({ fileNode, pluginParams, pluginOptions }) => {
    const { cache, reporter } = pluginParams
    const { withWebp = true, useImageCache = true } = pluginOptions

    if (!fileNode || !fileNode.absolutePath) {
        return false
    }

    const selector = `${fileNode.id}${withWebp ? `-webp` : ``}`
    const fluidImageKey = fluidImageCacheKey(selector)
    const cachedFluidImage = await cache.get(fluidImageKey)

    if (useImageCache && cachedFluidImage && cachedFluidImage.length > 0) {
        return JSON.parse(cachedFluidImage)
    }

    try {
        const { width, height } = await sharp(fileNode.absolutePath).metadata()
        const maxWidth = pluginOptions.maxWidth ? Math.min(pluginOptions.maxWidth, width) : width
        const aspectRatio = `${width / height}`

        const fluidParams = {
            file: fileNode,
            args: {
                ...pluginOptions,
                maxWidth,
            },
            reporter,
            cache,
        }

        let fluidResult = await fluid(fluidParams)

        let fluidResultWebp
        if (withWebp) {
            fluidParams.args.toFormat = `webp`
            fluidResultWebp = await fluid(fluidParams)
        }

        if (!fluidResult) {
            return false
        }

        if (withWebp) {
            fluidResult.srcSetWebp = fluidResultWebp.srcSet
        }

        if (useImageCache) {
            await cache.set(fluidImageKey, JSON.stringify(fluidResult))
        }

        return ({
            fluidResult,
            aspectRatio,
            maxWidth,
        })
    } catch (e) {
        throw Error(e)
    }
}

const downloadMediaFile = async ({ url, pluginParams }) => {
    const { cache, store, actions: { createNode, touchNode }, createNodeId, getNode } = pluginParams

    const cacheKey = fileCacheKey(url)
    const cachedFileData = await cache.get(cacheKey)

    let fileNode = false
    if (cachedFileData && cachedFileData.fileNodeId) {
        const fileNodeId = cachedFileData.fileNodeId
        fileNode = getNode(fileNodeId)

        if (fileNode) {
            touchNode({
                nodeId: fileNodeId,
            })
        }
    }

    if (fileNode) {
        return fileNode
    }

    try {
        fileNode = await createRemoteFileNode({
            url,
            store,
            cache,
            createNode,
            createNodeId,
        })

        if (fileNode) {
            await cache.set(cacheKey, { fileNodeId: fileNode.id })
        }
    } catch (e) {
        throw Error(e)
    }

    return fileNode
}
