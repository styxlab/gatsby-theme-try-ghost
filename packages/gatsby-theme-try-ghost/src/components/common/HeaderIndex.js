import React from 'react'
import PropTypes from 'prop-types'
import { Link, StaticQuery, graphql } from 'gatsby'

import { SiteNav, HeaderBackground } from '.'

const HeaderIndex = ({ data, theme }) => {
    const site = data.allGhostSettings.edges[0].node

    return (
        <header className="site-home-header">
            <HeaderBackground fluidImg={site.coverImageSharp} srcImg={site.cover_image}>
                <div className="inner">
                    <SiteNav theme={theme} className="site-nav" />
                    <div className="site-header-content">
                        <h1 className="site-title">
                            {site.logo ?
                                <Link to="/">
                                    <img className="site-logo" src={site.logo} alt={site.title} />
                                </Link>
                                : site.title
                            }
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
        file: PropTypes.object,
    }).isRequired,
    theme: PropTypes.shape({
        flavor: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
    }).isRequired,
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
                file(relativePath: {eq: "ghost-icon.png"}) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
            }
        `}
        render={data => <HeaderIndex data={data} {...props} />}
    />
)

export default HeaderIndexQuery
