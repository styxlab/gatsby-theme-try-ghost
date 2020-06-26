import React from 'react'
import PropTypes from 'prop-types'
import { Link, StaticQuery, graphql } from 'gatsby'

import { SiteNav, HeaderBackground } from '.'
import useOptions from '../../utils/use-options'
import { useLang, get } from '../../utils/use-lang'

const HeaderIndex = ({ data, overlay }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const site = data.allGhostSettings.edges[0].node
    const siteLogo = site.logoSharp && site.logoSharp.publicURL || site.logo
    const coverImg = site.coverImageSharp && site.coverImageSharp.publicURL || site.cover_image
    const title = text(`SITE_TITLE`, site.title)

    return (
        <header className="site-home-header">
            <HeaderBackground fluidImg={site.coverImageSharp} srcImg={coverImg}>
                <div className="inner">
                    <SiteNav className="site-nav" overlay={overlay}/>
                    <div className="site-header-content">
                        <h1 className="site-title">
                            {siteLogo ? (
                                <Link to={basePath}>
                                    <img className="site-logo" src={siteLogo} alt={title} />
                                </Link>
                            ) : (
                                title
                            )}
                        </h1>
                        <h2 className="site-description">{site.description}</h2>
                    </div>
                </div>
            </HeaderBackground>
        </header>
    )
}

HeaderIndex.propTypes = {
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
    overlay: PropTypes.object.isRequired,
}

const HeaderIndexQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForHeader {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
            }
        `}
        render={data => <HeaderIndex data={data} {...props} />}
    />
)

export default HeaderIndexQuery
