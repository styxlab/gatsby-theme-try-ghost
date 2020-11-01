import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useLang, get } from '../../../utils/use-lang';

const Banner = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9000;
    padding: 20px 0;
    color: #fff;
    text-align: center;
    background: #a4d037;
    transition: transform 0.35s cubic-bezier(0.19, 1, 0.22, 1);
    transform: translateY(${props => props.ordinate});
`

const CloseBanner = styled.a`
    html.casper &.subscribe-close-button{
        top: 10px;
    }
`

const SubscribeSuccess = ({ action, title }) => {
    const [translateY, setTranslatey] = useState(`-175%`)
    const text = get(useLang())
    useEffect(() => {
        const timer = setTimeout(
            () =>
                setTranslatey(
                    action === `subscribe` || action === `ssr` ? 0 : `-175%`
                ),
            500
        );
        return () => clearTimeout(timer);
    }, [setTranslatey, action])

    return (
        <Banner ordinate={translateY}>
            <CloseBanner
                onClick={(e) => {
                    e.preventDefault()
                    setTranslatey(`-175%`)
                }}
                className="subscribe-close-button"
            ></CloseBanner>
            {text(`SUBSCRIBED_TO`)} {title}!
        </Banner>
    )
}

SubscribeSuccess.propTypes = {
    action: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default SubscribeSuccess
