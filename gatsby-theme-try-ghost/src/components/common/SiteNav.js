import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { Navigation } from '.'
import RssIcon from './icons/rss-icon'
import TwitterIcon from './icons/twitter-icon'
import FacebookIcon from './icons/facebook-icon'

const SiteNav = ({ data, className, postTitle }) => {
    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node

    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    return (
        <nav className={className}>
            <div className="site-nav-left-wrapper">
                <div className="site-nav-left">
                    {site.logo ?
                        <a className="site-nav-logo" href={config.siteUrl}><img src={site.logo} alt={site.title} /></a>
                        : <a className="site-nav-logo" href={config.siteUrl}>{site.title}</a>
                    }
                    <div className="site-nav-content">
                        <Navigation data={site.navigation} />
                        { postTitle &&
                            <span className={`nav-post-title ${site.logo || `dash`}`}>{postTitle}</span>
                        }
                    </div>
                </div>
            </div>
            <div className="site-nav-right">
                <div className="social-links">
                    { site.facebook && <a href={ facebookUrl } className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook"><FacebookIcon /></a>}
                    { site.twitter && <a href={ twitterUrl } className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon /></a>}
                    <a className="rss-button" href={ `https://feedly.com/i/subscription/feed/${config.siteUrl}/rss/` } target="_blank" rel="noopener noreferrer" title="Rss"><RssIcon /></a>
                </div>
            </div>
        </nav>
    )
}

SiteNav.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.object.isRequired,
        site: PropTypes.object.isRequired,
    }).isRequired,
    className: PropTypes.string.isRequired,
    postTitle: PropTypes.string,
}

const SiteNavQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSiteNav {
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
        render={data => <SiteNav data={data} {...props} />}
    />
)

export default SiteNavQuery
