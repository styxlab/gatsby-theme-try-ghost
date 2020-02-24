import PropTypes from 'prop-types'

const BodyClass = ({ isHome, isPost, author, tags, page }) => {
    let classes = []

    const isAuthor = author && author.slug || false
    const isPage = page && page.slug || false

    isHome = isHome || false
    isPost = isPost || false
    tags = tags || []

    if (isHome) {
        classes.push(`home-template`)
    } else if (isPost) {
        classes.push(`post-template`)
    } else if (isPage) {
        classes.push(`page-template`)
        classes.push(`page-${page.slug}`)
    } else if (tags.length > 0) {
        classes.push(`tag-template`)
    } else if (isAuthor){
        classes.push(`author-template`)
        classes.push(`author-${author.slug}`)
    }

    if (tags) {
        classes = classes.concat(
            tags.map(({ slug }) => `tag-${slug}`)
        )
    }

    //if (context.includes('paged')) {
    //    classes.push('paged');
    //}

    return classes.join(` `).trim()
}

BodyClass.propTypes = {
    isHome: PropTypes.bool,
    isPost: PropTypes.bool,
    author: PropTypes.shape({
        slug: PropTypes.string.isRequired,
    }),
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            slug: PropTypes.string.isRequired,
        })
    ),
    page: PropTypes.shape({
        slug: PropTypes.string,
    }),
}

export default BodyClass
