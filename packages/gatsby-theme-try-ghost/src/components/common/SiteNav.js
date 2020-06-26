import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { Navigation, SocialLinks, DarkMode, SubscribeButton } from '.'
import { resolveUrl, appendBasePath } from '../../utils/routing'
import useOptions from '../../utils/use-options'
import { useLang, get } from '../../utils/use-lang'

const SiteNav = ({ data, className, postTitle, overlay }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node
    const title = text(`SITE_TITLE`, site.title)
    const secondaryNav = site.secondary_navigation && 0 < site.secondary_navigation.length
    const siteLogo = site.logoSharp && site.logoSharp.publicURL || site.logo

    // add basePath only to navigation items coming from Ghost CMS
    const navigation = site.navigation.map((item) => {
        const url = item.url.match(/^\s?http(s?)/gi) ? item.url : resolveUrl(basePath, `/`, item.url)
        return ({ ...item, url: url })
    })

    // overwrite navigation if specified in options
    const labels = navigation.map(item => item.label)
    if (labels.length > 0 && config.overwriteGhostNavigation && config.overwriteGhostNavigation.length > 0) {
        config.overwriteGhostNavigation.map((item) => {
            const index = item.label && labels.indexOf(item.label)
            if (index > -1 && navigation[index]) {
                navigation[index].url = item.url
            }
        })
    }

    // allow plugins to add menu items
    const urls = navigation.map(item => item.url)
    if (config.navigation && config.navigation.length > 0) {
        config.navigation.map(item => urls.indexOf(item.url) === -1 && navigation.push(item))
    }

    const siteUrl = appendBasePath(config.siteUrl, basePath)

    return (
        <nav className={className}>
            <div className="site-nav-left-wrapper">
                <div className="site-nav-left">
                    {siteLogo ? (
                        <a className="site-nav-logo" href={siteUrl}>
                            <img src={siteLogo} alt={title} />
                        </a>
                    ) : (
                        <a className="site-nav-logo" href={siteUrl}>{title}</a>
                    )}
                    <div className="site-nav-content">
                        <Navigation data={navigation} />
                        { postTitle &&
                            <span className={`nav-post-title ${site.logo || `dash`}`}>{postTitle}</span>
                        }
                    </div>
                </div>
            </div>
            <div className="site-nav-right">
                { secondaryNav ? (
                    <Navigation data={site.secondary_navigation} />
                ) : (
                    <div className="social-links">
                        <SocialLinks site={site} siteUrl={config.siteUrl} />
                    </div>
                )}
                <DarkMode />
                <SubscribeButton overlay={overlay} />
            </div>
        </nav>
    )
}

SiteNav.propTypes = {
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
        site: PropTypes.object.isRequired,
    }).isRequired,
    className: PropTypes.string.isRequired,
    postTitle: PropTypes.string,
    overlay: PropTypes.object,
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
