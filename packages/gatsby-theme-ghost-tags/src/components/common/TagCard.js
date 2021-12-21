import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { resolveUrl } from 'gatsby-theme-try-ghost/src/utils/routing'
import useOptions from 'gatsby-theme-try-ghost/src/utils/use-options'

import { ImgSharp } from 'gatsby-theme-try-ghost/src/components/common'
import { PostClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'

const TagCard = ({ tag, num, isHome }) => {
    const { basePath } = useOptions()
    const url = resolveUrl(basePath, tag.collectionPath, tag.slug, tag.url)
    const featImg = tag.featureImageSharp && tag.featureImageSharp.publicURL || tag.feature_image
    const fluidFeatureImg = tag.featureImageSharp && tag.featureImageSharp.childImageSharp && tag.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ isImage: featImg && true })
    const large = featImg && isHome && 0 === num % 6 && `post-card-large` || ``

    return (
        <article className={`post-card ${postClass} ${large}`}>

            <Link className="post-card-image-link" to={url}>
                <ImgSharp clearPosition={true} fluidClass="post-card-image" srcClass="post-card-image" fluidImg={fluidFeatureImg} srcImg={featImg} title={tag.name} />
            </Link>

            <div className="post-card-content">
                <Link className="post-card-content-link" to={url} >
                    <header className="post-card-header">
                        <h2 className="post-card-title">{tag.name}</h2>
                    </header>
                    <section className="post-card-excerpt">
                        <p>{tag.description || ``}</p>
                        <p>A collection of {tag.count.posts} posts</p>
                    </section>
                </Link>
            </div>
        </article>
    )
}

TagCard.propTypes = {
    tag: PropTypes.shape({
        url: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        feature_image: PropTypes.string,
        featureImageSharp: PropTypes.object,
        collectionPath: PropTypes.string,
        count: PropTypes.shape({
            posts: PropTypes.number,
        }),
    }).isRequired,
    num: PropTypes.number,
    isHome: PropTypes.bool,
}

export default TagCard
