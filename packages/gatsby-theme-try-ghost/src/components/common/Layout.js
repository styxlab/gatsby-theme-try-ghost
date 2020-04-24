import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { DocumentHead, StickyNav } from '.'
import { BodyClass } from './helpers'

import { appendBasePath } from '../../utils/routing'
import useOptions from '../../utils/use-options'

// Styles
import '../../styles/screen.css'
import '../../styles/dark-mode.css'
import '../../styles/pagination.css'
import '../../styles/toc.css'

// Styles from other plugins
import '../../styles/custom-styles'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const DefaultLayout = ({ data, header, children, isHome, isPost, sticky, previewPosts, author, tags, page, errorClass }) => {
    const { basePath } = useOptions()
    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node
    const bodyClass = BodyClass({ isHome: isHome, isPost: isPost, author: author, tags: tags, page: page })

    const siteUrl = appendBasePath(config.siteUrl, basePath)
    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    errorClass = errorClass || ``

    return (
        <>
            {/* Dark Mode shadows DocumentHead */}
            <DocumentHead site={site} className={bodyClass} />

            <div className="site-wrapper">
                {/* The main header section on top of the screen */}
                {header}

                {/* The main content area */}
                <main ref={isHome && sticky && sticky.anchorRef} id="site-main" className={`site-main outer ${errorClass}`}>
                    {/* All the main content gets inserted here, index.js, post.js */}
                    {children}
                </main>

                {/* For sticky nav bar */}
                { isHome && <StickyNav className={`site-nav ${sticky && sticky.state.currentClass}`} />}

                {/* Links to Previous/Next posts */}
                {previewPosts}

                {/* The footer at the very bottom of the screen */}
                <footer className="site-footer outer" >
                    <div className="site-footer-content inner">
                        <section className="copyright">
                            <a href={config.siteUrl}>{site.title}</a> &copy; {new Date().getFullYear()}
                        </section>

                        <nav className="site-footer-nav">
                            <a href={siteUrl}>Latest Posts</a>
                            { site.facebook && <a href={facebookUrl}>Facebook</a> }
                            { site.twitter && <a href={twitterUrl}>Twitter</a> }
                            <a href="https://ghost.org" target="_blank" rel="noopener noreferrer">Ghost</a>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    )
}

DefaultLayout.propTypes = {
    header: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    previewPosts: PropTypes.node,
    isHome: PropTypes.bool,
    isPost: PropTypes.bool,
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
        file: PropTypes.object,
        site: PropTypes.object.isRequired,
    }).isRequired,
    sticky: PropTypes.shape({
        anchorRef: PropTypes.object.isRequired,
        state: PropTypes.shape({
            currentClass: PropTypes.string,
        }),
    }),
    author: PropTypes.object,
    tags: PropTypes.arrayOf(
        PropTypes.object.isRequired,
    ),
    page: PropTypes.object,
    errorClass: PropTypes.string,
}

const DefaultLayoutSettingsQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                file(relativePath: {eq: "ghost-icon.png"}) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
                site {
                    siteMetadata {
                        ...SiteMetadataFields
                    }
                }
            }
        `}
        render={data => <DefaultLayout data={data} {...props} />}
    />
)

export default DefaultLayoutSettingsQuery
