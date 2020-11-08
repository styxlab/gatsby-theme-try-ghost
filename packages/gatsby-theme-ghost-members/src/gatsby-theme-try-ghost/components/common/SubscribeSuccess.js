import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useLang, get } from '../../../utils/use-lang'

const SubscribeSuccess = ({ parsedQuery = {}, title }) => {
    const [type, setType] = useState(``)
    const [closeState, setCloseState] = useState(``)
    const { action, success } = parsedQuery
    const ssr = typeof window === `undefined`
    const showBanner = ssr || (action && action === `subscribe` && success !== undefined)
    const text = get(useLang())
    const message = success === `true` ? `${text(`SUBSCRIBED_TO`)} ${title}!` : `Could not sign up! Invalid sign up link.`
    useEffect(() => {
        setType(
            success === `true` ? `success` : `failure`
        )
    }
    , [setType, action])

    return (
        <div className={`subscribe-notification subscribe-${type}-message${closeState}`} style={{ opacity: showBanner ? 1 : 0 }}>
            <a
                onClick={(e) => {
                    e.preventDefault()
                    setCloseState(` close`)
                }}
                className="subscribe-close-button"
            ></a>
            {message}
        </div>
    )
}

SubscribeSuccess.propTypes = {
    action: PropTypes.string,
    title: PropTypes.string.isRequired,
    parsedQuery: PropTypes.object,
}

export default SubscribeSuccess
