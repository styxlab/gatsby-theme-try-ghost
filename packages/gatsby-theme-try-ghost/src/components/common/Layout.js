import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql, Link } from 'gatsby'

import { DocumentHead, StickyNav, SubscribeOverlay, SubscribeSuccess } from '.'
import { BodyClass } from './helpers'

import useOptions from '../../utils/use-options'
import { useLang, get } from '../../utils/use-lang'
import Search from '../Search'

// Styles
import '../../styles/screen.css'
import '../../styles/fluid.css'
import '../../styles/dark-mode.css'
import '../../styles/pagination.css'
import '../../styles/prism.css'
import '../../styles/toc.css'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const DefaultLayout = ({ data, header, children, isHome, isPost, sticky, previewPosts, author, tags, page, errorClass, action, overlay }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node
    const title = text(`SITE_TITLE`, site.title)
    const bodyClass = BodyClass({ isHome: isHome, isPost: isPost, author: author, tags: tags, page: page })

    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    errorClass = errorClass || ``

    return (
        <React.Fragment>
            {/* Dark Mode shadows DocumentHead */}
            <DocumentHead site={site} className={bodyClass} action={action} />

            <div className="site-wrapper">
                {/* The main header section on top of the screen */}
                {header}

                {/* The main content area */}
                <main ref={isHome && sticky && sticky.anchorRef} id="site-main" className={`site-main outer ${errorClass}`}>
                    <Search />
                    {/* All the main content gets inserted here, index.js, post.js */}
                    {children}
                </main>

                {/* For sticky nav bar */}
                { isHome && <StickyNav className={`site-nav ${sticky && sticky.state.currentClass}`} overlay={overlay}/>}

                {/* Links to Previous/Next posts */}
                {previewPosts}

                {/* The footer at the very bottom of the screen */}
                <footer className="site-footer outer" >
                    <div className="site-footer-content inner">
                        <section className="copyright">
                            <a href={config.siteUrl}>{title}</a> &copy; {new Date().getFullYear()}
                        </section>

                        <nav className="site-footer-nav">
                            <Link to={basePath}>{text(`LATEST_POSTS`)}</Link>
                            { site.facebook && <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a> }
                            { site.twitter && <a href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a> }
                            <a href="https://www.jamify.org" target="_blank" rel="noopener noreferrer">Jamify</a>
                        </nav>
                    </div>
                </footer>
            </div>

            <SubscribeSuccess action={action} title={title} />

            {/* The big email subscribe modal content */}
            <SubscribeOverlay overlay={overlay} />

        </React.Fragment>
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
    action: PropTypes.string,
    overlay: PropTypes.object,
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
