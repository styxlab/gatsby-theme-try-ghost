import React from 'react'
import PropTypes from 'prop-types'

import { useLang, get } from '../../utils/use-lang'

const SubscribeSuccess = ({ action, title }) => {
    const text = get(useLang())
    const show = act => (act === `subscribe` || act === `ssr` ? 1 : 0)

    return (
        <div className="subscribe-success-message" style={{ opacity: show(action) }}>
            <a className="subscribe-close"></a>
            {text(`SUBSCRIBED_TO`)} {title}!
        </div>
    )
}

SubscribeSuccess.propTypes = {
    action: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default SubscribeSuccess
