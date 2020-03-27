import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import ThemeContext from '../../../context/ThemeContext'

const DocumentHead = ({ site, className }) => (
    <ThemeContext.Consumer>{theme => (
        <Helmet>
            <html lang={site.lang} />
            <style type="text/css">{`${site.codeinjection_styles}`}</style>
            <body className={`${className} ${theme.dark ? `dark` : ``}`} />
        </Helmet>
    )}
    </ThemeContext.Consumer>
)

DocumentHead.propTypes = {
    site: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
}

export default DocumentHead
