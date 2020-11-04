import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ThemeContext from '../../../context/ThemeContext'

const DocumentHead = ({ site, className, action }) => (
    <ThemeContext.Consumer>{theme => (
        <Helmet>
            <html lang={site.lang} className="casper"/>
            <style type="text/css">{`${site.codeinjection_styles}`}</style>
            <body className={`${className} ${theme.dark ? `dark` : ``}${action === `subscribe` ? ` subscribe-success` : ``}`} />
        </Helmet>
    )}
    </ThemeContext.Consumer>
)

DocumentHead.propTypes = {
    site: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    action: PropTypes.string,
}

export default DocumentHead
