import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useLang, get } from '../../../utils/use-lang'

const SubscribeSuccess = ({ parsedQuery = {}, title }) => {
    const [type, setType] = useState(``)
    const [closeState, setCloseState] = useState(``)
    const [closeButtonOpacity, setCloseButtonOpacity] = useState(0)
    const { action, success } = parsedQuery
    const ssr = typeof window === `undefined`
    const showBanner = ssr || (action && action === `subscribe` && success !== undefined)
    const text = get(useLang())
    const message = success === `true` ? `${text(`SUBSCRIBED_TO`)} ${title}!` : `Could not sign up! Invalid sign up link.`
    useEffect(() => {
        const timer = setTimeout(
            () =>
                setCloseButtonOpacity(1),
            1500
        );
        setType(
            success === `true` ? `success` : `failure`
        )
        return () => clearTimeout(timer);
    }
    , [setType, setCloseButtonOpacity, action])

    return (
        <Banner opacity={showBanner} className={`subscribe-notification subscribe-${type}-message${closeState}`}>
            <CloseButton opacity={closeButtonOpacity}
                onClick={(e) => {
                    e.preventDefault()
                    setCloseState(` close`)
                }}
                className="subscribe-close-button"
            ></CloseButton>
            {message}
        </Banner>
    )
}

SubscribeSuccess.propTypes = {
    action: PropTypes.string,
    title: PropTypes.string.isRequired,
    parsedQuery: PropTypes.object,
}
const Banner = styled.div`
    html.casper &.subscribe-notification {
        opacity: ${props => props.opacity ? 1 : 0};
        @media (max-width: 368px) {
            padding: 5.5rem 0 2rem;
        }
    }
`

const CloseButton = styled.a`
    html.casper .subscribe-notification &.subscribe-close-button {
        left: unset;
        right: 0;
        width: 5rem;
        opacity: ${props => props.opacity};
        &:hover {
            cursor: pointer;
        }
    }
`

export default SubscribeSuccess
