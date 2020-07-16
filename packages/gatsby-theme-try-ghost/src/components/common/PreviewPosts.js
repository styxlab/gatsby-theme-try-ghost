import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { PostCard } from '.'

import { readingTime as readingTimeHelper } from '@tryghost/helpers'
import { resolveUrl } from '../../utils/routing'
import useOptions from '../../utils/use-options'
import { useLang, get } from '../../utils/use-lang'

const PreviewPosts = ({ primaryTag, posts, primaryTagCount, prev, next }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const url = primaryTag && resolveUrl(basePath, `/`, primaryTag.slug, primaryTag.url)

    return (
        <aside className="read-next outer">
            <div className ="inner">
                <div className="read-next-feed">
                    { 0 < posts.length &&
                        <article className="read-next-card">
                            <header className="read-next-card-header">
                                <h3><span>{text(`MORE_IN`)}</span> <Link to={url}>{primaryTag.name}</Link></h3>
                            </header>
                            <div className="read-next-card-content">
                                <ul>
                                    {posts.map(({ node }, i) => (
                                        <li key={i}>
                                            <h4><Link to={resolveUrl(basePath, node.collectionPath, node.slug, node.url)}>{node.title}</Link></h4>
                                            <div className="read-next-card-meta">
                                                <p><time dateTime={node.published_at}>{node.published_at_pretty}</time> – {readingTimeHelper(node).replace(`min read`,text(`MIN_READ`))}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <footer className="read-next-card-footer">
                                <Link to={url}>
                                    {primaryTagCount > 0 && (primaryTagCount === 1 ? `1 ${text(`POST`)}` : `${text(`SEE_ALL`)} ${primaryTagCount} ${text(`POSTS`)}`) || text(`NO_POSTS`)} →
                                </Link>
                            </footer>
                        </article>
                    }

                    { prev && prev.slug && <PostCard post={prev} />}

                    { next && next.slug && <PostCard post={next} />}

                </div>
            </div>
        </aside>
    )
}

PreviewPosts.propTypes = {
    primaryTag: PropTypes.object.isRequired,
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            node: PropTypes.shape({
                slug: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                published_at: PropTypes.string.isRequired,
                published_at_pretty: PropTypes.string.isRequired,
                primary_tag: PropTypes.shape({
                    slug: PropTypes.string.isRequired,
                    url: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                }),
            }),
        }),
    ),
    primaryTagCount: PropTypes.number.isRequired,
    prev: PropTypes.object,
    next: PropTypes.object,
}

export default PreviewPosts
