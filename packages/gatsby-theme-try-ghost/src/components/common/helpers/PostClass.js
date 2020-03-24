import PropTypes from 'prop-types'
import _ from 'lodash'

const PostClass = ({ tags, isFeatured, isImage, isPage }) => {
    var classes = [`post`]

    tags = tags || []
    isFeatured = isFeatured || false
    isImage = isImage || false
    isPage = isPage || false

    if (tags) {
        classes = classes.concat(tags.map(function (tag) {
            return `tag-` + tag.slug
        }))
    }

    if (isFeatured) {
        classes.push(`featured`)
    }

    if (!isImage) {
        classes.push(`no-image`)
    }

    if (isPage) {
        classes.push(`page`)
    }

    classes = _.reduce(classes, function (memo, item) {
        return memo + ` ` + item
    }, ``)

    return classes.trim()
}

PostClass.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            slug: PropTypes.string.isRequired,
        })
    ),
    isFeatured: PropTypes.bool,
    isImage: PropTypes.bool,
    isPage: PropTypes.bool,
}

export default PostClass
