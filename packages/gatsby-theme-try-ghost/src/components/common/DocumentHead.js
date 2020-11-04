import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

const DocumentHead = ({ site, className, parsedQuery = {} }) => {
    const { action, success } = parsedQuery
    return (
        <Helmet>
            <html lang={site.lang} className="casper" />
            <style type="text/css">{`${site.codeinjection_styles}`}</style>
            <body className={`${className} ${action && action === `subscribe` ? success === `true` ? `subscribe-success` : `subscribe-failure` : ``}`} />
        </Helmet>
    )
}

DocumentHead.propTypes = {
    site: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    action: PropTypes.string,
}

export default DocumentHead
