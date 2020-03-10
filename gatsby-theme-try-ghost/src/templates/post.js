import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { readingTime as readingTimeHelper } from '@tryghost/helpers'
import { Layout, HeaderPost, AuthorList, PreviewPosts, ImgSharp } from '../components/common'
import { StickyNavContainer } from '../components/common/effects'
import { MetaData } from '../components/common/meta'

import { PostClass } from '../components/common/helpers'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location, pageContext }) => {
    const post = data.post
    const prevPost = data.prev
    const nextPost = data.next
    const previewPosts = data.allGhostPost.edges
    const readingTime = readingTimeHelper(post)
    const featImg = post.feature_image
    const fluidFeatureImg = post.featureImage && post.featureImage.childImageSharp && post.featureImage.childImageSharp.fluid
    const postClass = PostClass({ tags: post.tags, isFeatured: featImg, isImage: featImg && true })

    const primaryTagCount = pageContext.primaryTagCount
    const transformedHtml = post.children[0] && post.children[0].html

    return (
        <>
            <MetaData data={data} location={location} type="article"/>
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <StickyNavContainer isPost={true} activeClass="nav-post-title-active" render={ sticky => (
                <Layout isPost={true} sticky={sticky}
                    header={<HeaderPost sticky={sticky} title={post.title} />}
                    previewPosts={<PreviewPosts posts={previewPosts} primaryTagCount={primaryTagCount} prev={prevPost} next={nextPost} />}>
                    <div className="inner">
                        <article className={`post-full ${postClass}`}>
                            <header className="post-full-header">
                                { post.primary_tag &&
                                    <section className="post-full-tags">
                                        <Link to={`/tag/${post.primary_tag.slug}/`}>{post.primary_tag.name}</Link>
                                    </section>
                                }

                                <h1 ref={sticky && sticky.anchorRef} className="post-full-title">{post.title}</h1>

                                { post.custom_excerpt &&
                                    <p className="post-full-custom-excerpt">{post.custom_excerpt}</p>
                                }

                                <div className="post-full-byline">
                                    <section className="post-full-byline-content">
                                        <AuthorList authors={post.authors} isPost={true} />

                                        <section className="post-full-byline-meta">
                                            <h4 className="author-name">
                                                {post.authors.map((author, i) => (
                                                    <Link key={i} to={`/author/${author.slug}/`} >{author.name}</Link>
                                                ))}
                                            </h4>
                                            <div className="byline-meta-content">
                                                <time className="byline-meta-date" dateTime={post.published_at}>
                                                    {post.published_at_pretty}&nbsp;
                                                </time>
                                                <span className="byline-reading-time"><span className="bull">&bull;</span> {readingTime}</span>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                            </header>

                            <figure className="post-full-image">
                                <ImgSharp fluidClass="kg-card kg-code-card" fluidImg={fluidFeatureImg} srcImg={featImg} title={post.title} />
                            </figure>

                            <section className="post-full-content">
                                <div className="post-content load-external-scripts"
                                    dangerouslySetInnerHTML={{ __html: transformedHtml || post.html }}/>
                            </section>
                        </article>
                    </div>
                </Layout>
            )}/>
        </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        post: PropTypes.shape({
            codeinjection_styles: PropTypes.string,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            custom_excerpt: PropTypes.string,
            feature_image: PropTypes.string,
            featured: PropTypes.bool,
            tags: PropTypes.arrayOf(
                PropTypes.object.isRequired,
            ),
            authors: PropTypes.arrayOf(
                PropTypes.object.isRequired,
            ).isRequired,
            primary_tag: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
            }),
            published_at: PropTypes.string.isRequired,
            published_at_pretty: PropTypes.string.isRequired,
            children: PropTypes.arrayOf(
                PropTypes.object,
            ),
            featureImage: PropTypes.object,
        }).isRequired,
        prev: PropTypes.object,
        next: PropTypes.object,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object,
}

export default Post

export const postQuery = graphql`
    query($slug: String!, $prev: String!, $next: String!, $tag: String!, $limit: Int!, $skip: Int!) {
        post: ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
        prev: ghostPost(slug: { eq: $prev }) {
            ...GhostPostFields
        }
        next: ghostPost(slug: { eq: $next }) {
            ...GhostPostFields
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            filter: {slug: { ne: $slug },tags: {elemMatch: {slug: {eq: $tag}}}},
            limit: $limit,
            skip: $skip
        ) {
            edges {
                node {
                ...GhostPostFields
                }
            }
        }
    }
`
