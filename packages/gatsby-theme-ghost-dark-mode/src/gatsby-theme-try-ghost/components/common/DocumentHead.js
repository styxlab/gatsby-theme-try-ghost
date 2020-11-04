import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ThemeContext from '../../../context/ThemeContext'

const DocumentHead = ({ site, className, parsedQuery :{action, success} }) => (
    <ThemeContext.Consumer>{theme => (
        <Helmet>
            <html lang={site.lang} className="casper"/>
            <style type="text/css">{`${site.codeinjection_styles}`}</style>
            <body className={`${className} ${theme.dark && `dark`}  ${action && action === `subscribe`  ? success === `true` ? `subscribe-success` : `subscribe-failure` : ``}`} />
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
