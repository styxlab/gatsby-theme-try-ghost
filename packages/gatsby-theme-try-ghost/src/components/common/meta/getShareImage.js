import PropTypes from 'prop-types'
import url from 'url'

const getShareImage = (sharpImages, fallbackUrl, siteUrl) => {
    let imageSharp = sharpImages.find(image => image && image.publicURL && image.publicURL.length > 0)

    if (imageSharp === undefined) {
        imageSharp = { publicURL: fallbackUrl, imageMeta: { width: 1280, height: 640 } }
    }

    if (imageSharp.publicURL === null) {
        return (
            { imageMeta: {} }
        )
    }

    imageSharp.url = url.resolve(siteUrl, imageSharp.publicURL)
    return imageSharp
}

getShareImage.PropTypes = {
    sharpImages: PropTypes.arrayOf(PropTypes.object).isRequired,
    fallbackUrl: PropTypes.string,
    siteUrl: PropTypes.string.isRequired,
}

export default getShareImage
