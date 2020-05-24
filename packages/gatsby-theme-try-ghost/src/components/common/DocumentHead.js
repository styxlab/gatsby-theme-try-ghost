import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

const DocumentHead = ({ site, className, action }) => (
    <Helmet>
        <html lang={site.lang} />
        <style type="text/css">{`${site.codeinjection_styles}`}</style>
        <body className={`${className} ${action === `subscribe` && `subscribe-success`}`} />
    </Helmet>
)

DocumentHead.propTypes = {
    site: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    action: PropTypes.string,
}

export default DocumentHead
