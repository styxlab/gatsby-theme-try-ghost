import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { useLang, get } from '../../utils/use-lang'
import useOptions from '../../utils/use-options'

const Footer = ({ data }) => {
    const text = get(useLang())
    const { basePath } = useOptions()

    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node
    const title = text(`SITE_TITLE`, site.title) 

    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    return (
        <React.Fragment>
            {/* The footer at the very bottom of the screen */}
            <footer className="site-footer outer" >
                <div className="site-footer-content inner">
                    <section className="copyright">
                        <a href={config.siteUrl}>{title}</a> &copy; {new Date().getFullYear()}
                    </section>

                    <nav className="site-footer-nav">
                        <Link to={basePath}>{text(`LATEST_POSTS`)}</Link>
                        {site.facebook && <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>}
                        {site.twitter && <a href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>}
                        <a href="https://www.jamify.org" target="_blank" rel="noopener noreferrer">Jamify</a>
                    </nav>
                </div>
            </footer>
        </React.Fragment>
    )
}

Footer.propTypes = {
    data: PropTypes.object.isRequired,
}

export default Footer
